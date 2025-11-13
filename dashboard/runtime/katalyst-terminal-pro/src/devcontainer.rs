use anyhow::Result;
use bollard::{
    container::{Config, CreateContainerOptions, LogsOptions, RemoveContainerOptions, StartContainerOptions},
    exec::{CreateExecOptions, StartExecResults},
    image::CreateImageOptions,
    Docker,
};
use futures::StreamExt;
use oci_spec::{
    image::{ImageConfiguration, ImageManifest},
    runtime::{LinuxBuilder, ProcessBuilder, Spec, SpecBuilder},
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};
use tokio::{
    fs,
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    sync::RwLock,
};
use uuid::Uuid;

/// DevContainer runtime for isolated development environments
pub struct DevContainerRuntime {
    docker: Docker,
    config: DevContainerConfig,
    containers: Arc<RwLock<HashMap<String, Container>>>,
    specs: Arc<RwLock<HashMap<String, DevContainerSpec>>>,
}

impl DevContainerRuntime {
    pub async fn new(config: &DevContainerConfig) -> Result<Self> {
        // Connect to Docker
        let docker = if config.docker_host.is_some() {
            Docker::connect_with_socket(
                &config.docker_host.as_ref().unwrap(),
                120,
                bollard::API_DEFAULT_VERSION,
            )?
        } else {
            Docker::connect_with_local_defaults()?
        };
        
        // Verify Docker connection
        let version = docker.version().await?;
        tracing::info!("Connected to Docker: {:?}", version);
        
        Ok(Self {
            docker,
            config: config.clone(),
            containers: Arc::new(RwLock::new(HashMap::new())),
            specs: Arc::new(RwLock::new(HashMap::new())),
        })
    }
    
    pub async fn load_config(&self, repo_path: &str) -> Result<DevContainerSpec> {
        let devcontainer_path = Path::new(repo_path).join(".devcontainer");
        
        // Check for devcontainer.json
        let config_path = devcontainer_path.join("devcontainer.json");
        if !config_path.exists() {
            // Try .devcontainer.json in root
            let alt_path = Path::new(repo_path).join(".devcontainer.json");
            if alt_path.exists() {
                return self.parse_devcontainer_json(&alt_path).await;
            }
            
            // Create default configuration
            return Ok(self.create_default_spec(repo_path));
        }
        
        self.parse_devcontainer_json(&config_path).await
    }
    
    pub async fn create_container(&mut self, spec: &DevContainerSpec) -> Result<String> {
        let container_id = format!("katalyst-{}", Uuid::new_v4());
        
        tracing::info!("Creating container: {}", container_id);
        
        // Pull or build image
        let image = if let Some(ref dockerfile) = spec.dockerfile {
            self.build_image(&spec.name, dockerfile, &spec.context).await?
        } else {
            self.pull_image(&spec.image).await?;
            spec.image.clone()
        };
        
        // Create container configuration
        let mut config = Config {
            image: Some(image.clone()),
            hostname: Some(container_id.clone()),
            user: spec.remote_user.clone(),
            working_dir: Some("/workspace".to_string()),
            env: Some(self.build_environment(&spec)),
            cmd: spec.command.clone(),
            attach_stdin: Some(true),
            attach_stdout: Some(true),
            attach_stderr: Some(true),
            tty: Some(true),
            open_stdin: Some(true),
            stdin_once: Some(false),
            ..Default::default()
        };
        
        // Add mounts
        config.host_config = Some(bollard::models::HostConfig {
            binds: Some(self.build_mounts(&spec)),
            network_mode: Some("bridge".to_string()),
            privileged: Some(spec.privileged),
            cap_add: spec.cap_add.clone(),
            cap_drop: spec.cap_drop.clone(),
            security_opt: spec.security_opt.clone(),
            ..Default::default()
        });
        
        // Add port mappings
        if !spec.forward_ports.is_empty() {
            let mut port_bindings = HashMap::new();
            for port in &spec.forward_ports {
                port_bindings.insert(
                    format!("{}/tcp", port),
                    Some(vec![bollard::models::PortBinding {
                        host_ip: Some("0.0.0.0".to_string()),
                        host_port: Some(port.to_string()),
                    }]),
                );
            }
            
            if let Some(ref mut host_config) = config.host_config {
                host_config.port_bindings = Some(port_bindings);
            }
        }
        
        // Create container
        let create_options = CreateContainerOptions {
            name: container_id.clone(),
            platform: None,
        };
        
        let container = self.docker.create_container(Some(create_options), config).await?;
        
        // Start container
        self.docker.start_container(&container.id, None::<StartContainerOptions<String>>).await?;
        
        // Run post-create commands
        if let Some(ref commands) = spec.post_create_command {
            for command in commands {
                self.exec_in_container(&container.id, command).await?;
            }
        }
        
        // Run post-start commands
        if let Some(ref commands) = spec.post_start_command {
            for command in commands {
                self.exec_in_container(&container.id, command).await?;
            }
        }
        
        // Install extensions/tools
        if !spec.extensions.is_empty() {
            self.install_extensions(&container.id, &spec.extensions).await?;
        }
        
        // Register container
        let container_info = Container {
            id: container.id.clone(),
            name: container_id.clone(),
            spec: spec.clone(),
            created_at: chrono::Utc::now(),
            status: ContainerStatus::Running,
        };
        
        self.containers.write().await.insert(container_id.clone(), container_info);
        self.specs.write().await.insert(container_id.clone(), spec.clone());
        
        tracing::info!("Container created and started: {}", container_id);
        Ok(container_id)
    }
    
    pub async fn stop_container(&self, container_id: &str) -> Result<()> {
        tracing::info!("Stopping container: {}", container_id);
        
        self.docker.stop_container(container_id, None).await?;
        
        if let Some(mut container) = self.containers.write().await.get_mut(container_id) {
            container.status = ContainerStatus::Stopped;
        }
        
        Ok(())
    }
    
    pub async fn remove_container(&self, container_id: &str) -> Result<()> {
        tracing::info!("Removing container: {}", container_id);
        
        let options = RemoveContainerOptions {
            force: true,
            ..Default::default()
        };
        
        self.docker.remove_container(container_id, Some(options)).await?;
        
        self.containers.write().await.remove(container_id);
        self.specs.write().await.remove(container_id);
        
        Ok(())
    }
    
    pub async fn exec_in_container(&self, container_id: &str, command: &str) -> Result<String> {
        let exec_config = CreateExecOptions {
            attach_stdout: Some(true),
            attach_stderr: Some(true),
            cmd: Some(vec!["sh", "-c", command]),
            ..Default::default()
        };
        
        let exec = self.docker.create_exec(container_id, exec_config).await?;
        
        let start_exec = self.docker.start_exec(&exec.id, None).await?;
        
        let mut output = String::new();
        
        if let StartExecResults::Attached { mut output: stream, .. } = start_exec {
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(data) => output.push_str(&data.to_string()),
                    Err(e) => return Err(e.into()),
                }
            }
        }
        
        Ok(output)
    }
    
    pub async fn get_container_logs(&self, container_id: &str) -> Result<String> {
        let options = LogsOptions {
            stdout: true,
            stderr: true,
            tail: "100",
            ..Default::default()
        };
        
        let mut stream = self.docker.logs(container_id, Some(options));
        let mut logs = String::new();
        
        while let Some(chunk) = stream.next().await {
            match chunk {
                Ok(data) => logs.push_str(&data.to_string()),
                Err(e) => return Err(e.into()),
            }
        }
        
        Ok(logs)
    }
    
    pub async fn count_running(&self) -> usize {
        self.containers
            .read()
            .await
            .values()
            .filter(|c| c.status == ContainerStatus::Running)
            .count()
    }
    
    async fn parse_devcontainer_json(&self, path: &Path) -> Result<DevContainerSpec> {
        let content = fs::read_to_string(path).await?;
        let spec: DevContainerSpec = serde_json::from_str(&content)?;
        Ok(spec)
    }
    
    fn create_default_spec(&self, repo_path: &str) -> DevContainerSpec {
        // Detect project type and create appropriate spec
        let project_type = self.detect_project_type(repo_path);
        
        match project_type {
            ProjectType::Rust => self.rust_devcontainer_spec(),
            ProjectType::Node => self.node_devcontainer_spec(),
            ProjectType::Python => self.python_devcontainer_spec(),
            ProjectType::Go => self.go_devcontainer_spec(),
            _ => self.generic_devcontainer_spec(),
        }
    }
    
    fn detect_project_type(&self, repo_path: &str) -> ProjectType {
        let path = Path::new(repo_path);
        
        if path.join("Cargo.toml").exists() {
            ProjectType::Rust
        } else if path.join("package.json").exists() {
            ProjectType::Node
        } else if path.join("requirements.txt").exists() || path.join("pyproject.toml").exists() {
            ProjectType::Python
        } else if path.join("go.mod").exists() {
            ProjectType::Go
        } else if path.join("pom.xml").exists() || path.join("build.gradle").exists() {
            ProjectType::Java
        } else {
            ProjectType::Generic
        }
    }
    
    fn rust_devcontainer_spec(&self) -> DevContainerSpec {
        DevContainerSpec {
            name: "Rust Development".to_string(),
            image: "mcr.microsoft.com/devcontainers/rust:1-bullseye".to_string(),
            dockerfile: None,
            context: ".".to_string(),
            features: HashMap::from([
                ("ghcr.io/devcontainers/features/rust:1".to_string(), HashMap::new()),
                ("ghcr.io/devcontainers/features/github-cli:1".to_string(), HashMap::new()),
            ]),
            customizations: HashMap::new(),
            forward_ports: vec![],
            post_create_command: Some(vec![
                "rustup component add rust-analyzer".to_string(),
                "cargo build".to_string(),
            ]),
            post_start_command: None,
            post_attach_command: None,
            remote_user: Some("vscode".to_string()),
            remote_env: HashMap::new(),
            mounts: vec![],
            run_args: vec![],
            extensions: vec![
                "rust-lang.rust-analyzer".to_string(),
                "vadimcn.vscode-lldb".to_string(),
                "serayuzgur.crates".to_string(),
            ],
            settings: HashMap::new(),
            privileged: false,
            cap_add: None,
            cap_drop: None,
            security_opt: None,
            command: None,
        }
    }
    
    fn node_devcontainer_spec(&self) -> DevContainerSpec {
        DevContainerSpec {
            name: "Node.js Development".to_string(),
            image: "mcr.microsoft.com/devcontainers/javascript-node:20-bullseye".to_string(),
            dockerfile: None,
            context: ".".to_string(),
            features: HashMap::new(),
            customizations: HashMap::new(),
            forward_ports: vec![3000, 5000, 8080],
            post_create_command: Some(vec![
                "npm install".to_string(),
            ]),
            post_start_command: None,
            post_attach_command: None,
            remote_user: Some("node".to_string()),
            remote_env: HashMap::new(),
            mounts: vec![],
            run_args: vec![],
            extensions: vec![
                "dbaeumer.vscode-eslint".to_string(),
                "esbenp.prettier-vscode".to_string(),
            ],
            settings: HashMap::new(),
            privileged: false,
            cap_add: None,
            cap_drop: None,
            security_opt: None,
            command: None,
        }
    }
    
    fn python_devcontainer_spec(&self) -> DevContainerSpec {
        DevContainerSpec {
            name: "Python Development".to_string(),
            image: "mcr.microsoft.com/devcontainers/python:3.11-bullseye".to_string(),
            dockerfile: None,
            context: ".".to_string(),
            features: HashMap::new(),
            customizations: HashMap::new(),
            forward_ports: vec![5000, 8000],
            post_create_command: Some(vec![
                "pip install -r requirements.txt".to_string(),
            ]),
            post_start_command: None,
            post_attach_command: None,
            remote_user: Some("vscode".to_string()),
            remote_env: HashMap::new(),
            mounts: vec![],
            run_args: vec![],
            extensions: vec![
                "ms-python.python".to_string(),
                "ms-python.vscode-pylance".to_string(),
            ],
            settings: HashMap::new(),
            privileged: false,
            cap_add: None,
            cap_drop: None,
            security_opt: None,
            command: None,
        }
    }
    
    fn go_devcontainer_spec(&self) -> DevContainerSpec {
        DevContainerSpec {
            name: "Go Development".to_string(),
            image: "mcr.microsoft.com/devcontainers/go:1.21-bullseye".to_string(),
            dockerfile: None,
            context: ".".to_string(),
            features: HashMap::new(),
            customizations: HashMap::new(),
            forward_ports: vec![8080],
            post_create_command: Some(vec![
                "go mod download".to_string(),
            ]),
            post_start_command: None,
            post_attach_command: None,
            remote_user: Some("vscode".to_string()),
            remote_env: HashMap::new(),
            mounts: vec![],
            run_args: vec![],
            extensions: vec![
                "golang.go".to_string(),
            ],
            settings: HashMap::new(),
            privileged: false,
            cap_add: None,
            cap_drop: None,
            security_opt: None,
            command: None,
        }
    }
    
    fn generic_devcontainer_spec(&self) -> DevContainerSpec {
        DevContainerSpec {
            name: "Generic Development".to_string(),
            image: "mcr.microsoft.com/devcontainers/base:bullseye".to_string(),
            dockerfile: None,
            context: ".".to_string(),
            features: HashMap::from([
                ("ghcr.io/devcontainers/features/common-utils:2".to_string(), HashMap::new()),
            ]),
            customizations: HashMap::new(),
            forward_ports: vec![],
            post_create_command: None,
            post_start_command: None,
            post_attach_command: None,
            remote_user: Some("vscode".to_string()),
            remote_env: HashMap::new(),
            mounts: vec![],
            run_args: vec![],
            extensions: vec![],
            settings: HashMap::new(),
            privileged: false,
            cap_add: None,
            cap_drop: None,
            security_opt: None,
            command: None,
        }
    }
    
    async fn build_image(&self, name: &str, dockerfile: &str, context: &str) -> Result<String> {
        let image_name = format!("katalyst/{}", name.to_lowercase());
        
        tracing::info!("Building image: {}", image_name);
        
        // Build image
        let build_options = bollard::image::BuildImageOptions {
            dockerfile,
            t: &image_name,
            ..Default::default()
        };
        
        let tar = self.create_build_context(context).await?;
        let mut stream = self.docker.build_image(build_options, None, Some(tar.into()));
        
        while let Some(item) = stream.next().await {
            match item {
                Ok(output) => {
                    if let Some(stream) = output.stream {
                        tracing::debug!("Build output: {}", stream);
                    }
                }
                Err(e) => return Err(e.into()),
            }
        }
        
        Ok(image_name)
    }
    
    async fn pull_image(&self, image: &str) -> Result<()> {
        tracing::info!("Pulling image: {}", image);
        
        let options = CreateImageOptions {
            from_image: image,
            ..Default::default()
        };
        
        let mut stream = self.docker.create_image(Some(options), None, None);
        
        while let Some(item) = stream.next().await {
            match item {
                Ok(output) => {
                    if let Some(status) = output.status {
                        tracing::debug!("Pull status: {}", status);
                    }
                }
                Err(e) => return Err(e.into()),
            }
        }
        
        Ok(())
    }
    
    async fn create_build_context(&self, context_path: &str) -> Result<Vec<u8>> {
        // Create tar archive of build context
        // This is a simplified implementation
        Ok(Vec::new())
    }
    
    fn build_environment(&self, spec: &DevContainerSpec) -> Vec<String> {
        let mut env = vec![
            "TERM=xterm-256color".to_string(),
            "COLORTERM=truecolor".to_string(),
            "KATALYST_CONTAINER=true".to_string(),
        ];
        
        for (key, value) in &spec.remote_env {
            env.push(format!("{}={}", key, value));
        }
        
        env
    }
    
    fn build_mounts(&self, spec: &DevContainerSpec) -> Vec<String> {
        let mut mounts = vec![
            format!("{}:/workspace:cached", spec.context),
        ];
        
        for mount in &spec.mounts {
            mounts.push(mount.clone());
        }
        
        mounts
    }
    
    async fn install_extensions(&self, container_id: &str, extensions: &[String]) -> Result<()> {
        for extension in extensions {
            tracing::info!("Installing extension: {}", extension);
            // Install extension in container
            let command = format!("code --install-extension {}", extension);
            self.exec_in_container(container_id, &command).await?;
        }
        
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DevContainerSpec {
    pub name: String,
    pub image: String,
    pub dockerfile: Option<String>,
    pub context: String,
    pub features: HashMap<String, HashMap<String, serde_json::Value>>,
    pub customizations: HashMap<String, serde_json::Value>,
    pub forward_ports: Vec<u16>,
    pub post_create_command: Option<Vec<String>>,
    pub post_start_command: Option<Vec<String>>,
    pub post_attach_command: Option<Vec<String>>,
    pub remote_user: Option<String>,
    pub remote_env: HashMap<String, String>,
    pub mounts: Vec<String>,
    pub run_args: Vec<String>,
    pub extensions: Vec<String>,
    pub settings: HashMap<String, serde_json::Value>,
    pub privileged: bool,
    pub cap_add: Option<Vec<String>>,
    pub cap_drop: Option<Vec<String>>,
    pub security_opt: Option<Vec<String>>,
    pub command: Option<Vec<String>>,
}

#[derive(Debug, Clone)]
struct Container {
    id: String,
    name: String,
    spec: DevContainerSpec,
    created_at: chrono::DateTime<chrono::Utc>,
    status: ContainerStatus,
}

#[derive(Debug, Clone, PartialEq)]
enum ContainerStatus {
    Creating,
    Running,
    Stopped,
    Failed,
}

#[derive(Debug, Clone)]
enum ProjectType {
    Rust,
    Node,
    Python,
    Go,
    Java,
    Generic,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DevContainerConfig {
    pub docker_host: Option<String>,
    pub registry: Option<String>,
    pub default_image: String,
    pub workspace_folder: String,
    pub auto_remove: bool,
    pub resource_limits: ResourceLimits,
}

impl Default for DevContainerConfig {
    fn default() -> Self {
        Self {
            docker_host: None,
            registry: None,
            default_image: "mcr.microsoft.com/devcontainers/base:bullseye".to_string(),
            workspace_folder: "/workspace".to_string(),
            auto_remove: true,
            resource_limits: ResourceLimits::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceLimits {
    pub memory: Option<i64>,
    pub cpu_shares: Option<i64>,
    pub cpu_quota: Option<i64>,
}

impl Default for ResourceLimits {
    fn default() -> Self {
        Self {
            memory: Some(4 * 1024 * 1024 * 1024), // 4GB
            cpu_shares: Some(1024),
            cpu_quota: None,
        }
    }
}