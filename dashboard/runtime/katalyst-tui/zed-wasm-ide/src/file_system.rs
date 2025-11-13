use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    pub node_type: FileNodeType,
    pub size: usize,
    pub modified: u64,
    pub permissions: FilePermissions,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum FileNodeType {
    File,
    Directory,
    Symlink,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FilePermissions {
    pub read: bool,
    pub write: bool,
    pub execute: bool,
}

impl Default for FilePermissions {
    fn default() -> Self {
        Self {
            read: true,
            write: true,
            execute: false,
        }
    }
}

pub struct FileSystem {
    files: HashMap<String, Vec<u8>>,
    directories: HashMap<String, Vec<String>>,
    metadata: HashMap<String, FileNode>,
}

impl FileSystem {
    pub fn new() -> Self {
        let mut fs = Self {
            files: HashMap::new(),
            directories: HashMap::new(),
            metadata: HashMap::new(),
        };
        
        // Initialize with root directory
        fs.create_directory("/").unwrap();
        
        fs
    }
    
    pub async fn read_file(&self, path: &str) -> Result<String, String> {
        let normalized_path = normalize_path(path);
        
        self.files.get(&normalized_path)
            .map(|bytes| String::from_utf8_lossy(bytes).to_string())
            .ok_or_else(|| format!("File not found: {}", path))
    }
    
    pub async fn read_file_bytes(&self, path: &str) -> Result<Vec<u8>, String> {
        let normalized_path = normalize_path(path);
        
        self.files.get(&normalized_path)
            .cloned()
            .ok_or_else(|| format!("File not found: {}", path))
    }
    
    pub async fn write_file(&mut self, path: &str, content: &str) -> Result<(), String> {
        let normalized_path = normalize_path(path);
        
        // Ensure parent directory exists
        if let Some(parent) = get_parent_path(&normalized_path) {
            if !self.directories.contains_key(&parent) {
                self.create_directory(&parent)?;
            }
            
            // Add to parent directory listing
            let dir_entries = self.directories.entry(parent.clone()).or_insert_with(Vec::new);
            let file_name = get_file_name(&normalized_path);
            if !dir_entries.contains(&file_name) {
                dir_entries.push(file_name.clone());
            }
        }
        
        // Write file content
        self.files.insert(normalized_path.clone(), content.as_bytes().to_vec());
        
        // Update metadata
        let file_name = get_file_name(&normalized_path);
        self.metadata.insert(normalized_path.clone(), FileNode {
            name: file_name,
            path: normalized_path,
            node_type: FileNodeType::File,
            size: content.len(),
            modified: current_timestamp(),
            permissions: FilePermissions::default(),
        });
        
        Ok(())
    }
    
    pub async fn write_file_bytes(&mut self, path: &str, content: Vec<u8>) -> Result<(), String> {
        let normalized_path = normalize_path(path);
        
        // Ensure parent directory exists
        if let Some(parent) = get_parent_path(&normalized_path) {
            if !self.directories.contains_key(&parent) {
                self.create_directory(&parent)?;
            }
            
            // Add to parent directory listing
            let dir_entries = self.directories.entry(parent.clone()).or_insert_with(Vec::new);
            let file_name = get_file_name(&normalized_path);
            if !dir_entries.contains(&file_name) {
                dir_entries.push(file_name.clone());
            }
        }
        
        let size = content.len();
        
        // Write file content
        self.files.insert(normalized_path.clone(), content);
        
        // Update metadata
        let file_name = get_file_name(&normalized_path);
        self.metadata.insert(normalized_path.clone(), FileNode {
            name: file_name,
            path: normalized_path,
            node_type: FileNodeType::File,
            size,
            modified: current_timestamp(),
            permissions: FilePermissions::default(),
        });
        
        Ok(())
    }
    
    pub async fn delete_file(&mut self, path: &str) -> Result<(), String> {
        let normalized_path = normalize_path(path);
        
        if !self.files.contains_key(&normalized_path) {
            return Err(format!("File not found: {}", path));
        }
        
        // Remove from parent directory listing
        if let Some(parent) = get_parent_path(&normalized_path) {
            if let Some(dir_entries) = self.directories.get_mut(&parent) {
                let file_name = get_file_name(&normalized_path);
                dir_entries.retain(|name| name != &file_name);
            }
        }
        
        self.files.remove(&normalized_path);
        self.metadata.remove(&normalized_path);
        
        Ok(())
    }
    
    pub fn create_directory(&mut self, path: &str) -> Result<(), String> {
        let normalized_path = normalize_path(path);
        
        if self.directories.contains_key(&normalized_path) {
            return Ok(()); // Directory already exists
        }
        
        // Ensure parent directory exists
        if normalized_path != "/" {
            if let Some(parent) = get_parent_path(&normalized_path) {
                if !self.directories.contains_key(&parent) {
                    self.create_directory(&parent)?;
                }
                
                // Add to parent directory listing
                let dir_entries = self.directories.entry(parent.clone()).or_insert_with(Vec::new);
                let dir_name = get_file_name(&normalized_path);
                if !dir_entries.contains(&dir_name) {
                    dir_entries.push(dir_name.clone());
                }
            }
        }
        
        self.directories.insert(normalized_path.clone(), Vec::new());
        
        // Update metadata
        let dir_name = if normalized_path == "/" {
            "/".to_string()
        } else {
            get_file_name(&normalized_path)
        };
        
        self.metadata.insert(normalized_path.clone(), FileNode {
            name: dir_name,
            path: normalized_path,
            node_type: FileNodeType::Directory,
            size: 0,
            modified: current_timestamp(),
            permissions: FilePermissions {
                read: true,
                write: true,
                execute: true,
            },
        });
        
        Ok(())
    }
    
    pub async fn list_directory(&self, path: &str) -> Result<Vec<FileNode>, String> {
        let normalized_path = normalize_path(path);
        
        let entries = self.directories.get(&normalized_path)
            .ok_or_else(|| format!("Directory not found: {}", path))?;
        
        let mut nodes = Vec::new();
        
        for entry_name in entries {
            let entry_path = if normalized_path == "/" {
                format!("/{}", entry_name)
            } else {
                format!("{}/{}", normalized_path, entry_name)
            };
            
            if let Some(metadata) = self.metadata.get(&entry_path) {
                nodes.push(metadata.clone());
            }
        }
        
        Ok(nodes)
    }
    
    pub async fn exists(&self, path: &str) -> bool {
        let normalized_path = normalize_path(path);
        self.files.contains_key(&normalized_path) || self.directories.contains_key(&normalized_path)
    }
    
    pub async fn is_file(&self, path: &str) -> bool {
        let normalized_path = normalize_path(path);
        self.files.contains_key(&normalized_path)
    }
    
    pub async fn is_directory(&self, path: &str) -> bool {
        let normalized_path = normalize_path(path);
        self.directories.contains_key(&normalized_path)
    }
    
    pub async fn get_metadata(&self, path: &str) -> Result<FileNode, String> {
        let normalized_path = normalize_path(path);
        
        self.metadata.get(&normalized_path)
            .cloned()
            .ok_or_else(|| format!("Path not found: {}", path))
    }
    
    pub async fn rename(&mut self, old_path: &str, new_path: &str) -> Result<(), String> {
        let old_normalized = normalize_path(old_path);
        let new_normalized = normalize_path(new_path);
        
        if old_normalized == new_normalized {
            return Ok(());
        }
        
        // Check if source exists
        let is_file = self.files.contains_key(&old_normalized);
        let is_dir = self.directories.contains_key(&old_normalized);
        
        if !is_file && !is_dir {
            return Err(format!("Path not found: {}", old_path));
        }
        
        if is_file {
            // Move file
            if let Some(content) = self.files.remove(&old_normalized) {
                self.files.insert(new_normalized.clone(), content);
            }
        } else {
            // Move directory
            if let Some(entries) = self.directories.remove(&old_normalized) {
                self.directories.insert(new_normalized.clone(), entries);
            }
        }
        
        // Update metadata
        if let Some(mut metadata) = self.metadata.remove(&old_normalized) {
            metadata.path = new_normalized.clone();
            metadata.name = get_file_name(&new_normalized);
            self.metadata.insert(new_normalized.clone(), metadata);
        }
        
        // Update parent directory listings
        if let Some(old_parent) = get_parent_path(&old_normalized) {
            if let Some(dir_entries) = self.directories.get_mut(&old_parent) {
                let old_name = get_file_name(&old_normalized);
                dir_entries.retain(|name| name != &old_name);
            }
        }
        
        if let Some(new_parent) = get_parent_path(&new_normalized) {
            let dir_entries = self.directories.entry(new_parent).or_insert_with(Vec::new);
            let new_name = get_file_name(&new_normalized);
            if !dir_entries.contains(&new_name) {
                dir_entries.push(new_name);
            }
        }
        
        Ok(())
    }
}

fn normalize_path(path: &str) -> String {
    let mut normalized = path.trim().to_string();
    
    // Ensure path starts with /
    if !normalized.starts_with('/') {
        normalized = format!("/{}", normalized);
    }
    
    // Remove trailing slash except for root
    if normalized.len() > 1 && normalized.ends_with('/') {
        normalized.pop();
    }
    
    // Simplify path (remove . and .., handle //)
    let parts: Vec<&str> = normalized.split('/').filter(|p| !p.is_empty() && *p != ".").collect();
    let mut stack = Vec::new();
    
    for part in parts {
        if part == ".." {
            stack.pop();
        } else {
            stack.push(part);
        }
    }
    
    if stack.is_empty() {
        "/".to_string()
    } else {
        format!("/{}", stack.join("/"))
    }
}

fn get_parent_path(path: &str) -> Option<String> {
    if path == "/" {
        return None;
    }
    
    let normalized = normalize_path(path);
    let last_slash = normalized.rfind('/')?;
    
    if last_slash == 0 {
        Some("/".to_string())
    } else {
        Some(normalized[..last_slash].to_string())
    }
}

fn get_file_name(path: &str) -> String {
    let normalized = normalize_path(path);
    
    if normalized == "/" {
        return "/".to_string();
    }
    
    normalized.rsplit('/').next().unwrap_or("").to_string()
}

fn current_timestamp() -> u64 {
    // In WASM, use JavaScript Date
    #[cfg(target_arch = "wasm32")]
    {
        js_sys::Date::now() as u64
    }
    
    #[cfg(not(target_arch = "wasm32"))]
    {
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64
    }
}