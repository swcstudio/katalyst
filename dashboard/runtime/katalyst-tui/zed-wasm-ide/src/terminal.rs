use std::collections::VecDeque;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use vt100;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalSize {
    pub rows: u16,
    pub cols: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerminalState {
    pub cursor_x: u16,
    pub cursor_y: u16,
    pub cursor_visible: bool,
    pub buffer: Vec<String>,
    pub scrollback: VecDeque<String>,
    pub size: TerminalSize,
}

pub struct Terminal {
    parser: vt100::Parser,
    command_history: VecDeque<String>,
    current_directory: String,
    environment: std::collections::HashMap<String, String>,
    output_buffer: String,
}

impl Terminal {
    pub fn new() -> Self {
        let mut parser = vt100::Parser::new(24, 80, 1000);
        
        let mut environment = std::collections::HashMap::new();
        environment.insert("HOME".to_string(), "/home/user".to_string());
        environment.insert("PATH".to_string(), "/usr/bin:/bin".to_string());
        environment.insert("SHELL".to_string(), "/bin/bash".to_string());
        environment.insert("TERM".to_string(), "xterm-256color".to_string());
        
        Self {
            parser,
            command_history: VecDeque::with_capacity(1000),
            current_directory: "/".to_string(),
            environment,
            output_buffer: String::new(),
        }
    }
    
    pub async fn execute_command(&mut self, command: &str) -> Result<String, String> {
        // Add to history
        self.command_history.push_back(command.to_string());
        if self.command_history.len() > 1000 {
            self.command_history.pop_front();
        }
        
        // Parse and execute command
        let parts: Vec<&str> = command.split_whitespace().collect();
        if parts.is_empty() {
            return Ok(String::new());
        }
        
        let output = match parts[0] {
            "echo" => self.cmd_echo(&parts[1..]),
            "pwd" => self.cmd_pwd(),
            "cd" => self.cmd_cd(parts.get(1).copied()),
            "ls" => self.cmd_ls(parts.get(1).copied()),
            "cat" => self.cmd_cat(parts.get(1).copied()),
            "mkdir" => self.cmd_mkdir(parts.get(1).copied()),
            "rm" => self.cmd_rm(parts.get(1).copied()),
            "touch" => self.cmd_touch(parts.get(1).copied()),
            "env" => self.cmd_env(),
            "export" => self.cmd_export(parts.get(1).copied()),
            "history" => self.cmd_history(),
            "clear" => self.cmd_clear(),
            "help" => self.cmd_help(),
            _ => Err(format!("Command not found: {}", parts[0])),
        };
        
        match output {
            Ok(text) => {
                // Process through VT100 parser
                self.parser.process(text.as_bytes());
                Ok(text)
            }
            Err(e) => {
                let error_msg = format!("Error: {}\n", e);
                self.parser.process(error_msg.as_bytes());
                Err(e)
            }
        }
    }
    
    pub async fn write_input(&mut self, input: &str) {
        self.output_buffer.push_str(input);
        self.parser.process(input.as_bytes());
    }
    
    pub async fn resize(&mut self, rows: u16, cols: u16) {
        self.parser = vt100::Parser::new(rows, cols, 1000);
    }
    
    pub async fn get_state(&self) -> TerminalState {
        let screen = self.parser.screen();
        let mut buffer = Vec::new();
        
        for row in 0..screen.size().rows {
            let mut line = String::new();
            for col in 0..screen.size().cols {
                let cell = screen.cell(row, col).unwrap();
                line.push(cell.contents());
            }
            buffer.push(line.trim_end().to_string());
        }
        
        TerminalState {
            cursor_x: screen.cursor_position().1,
            cursor_y: screen.cursor_position().0,
            cursor_visible: !screen.hide_cursor(),
            buffer,
            scrollback: self.command_history.clone(),
            size: TerminalSize {
                rows: screen.size().rows,
                cols: screen.size().cols,
            },
        }
    }
    
    pub async fn clear(&mut self) {
        self.output_buffer.clear();
        self.parser = vt100::Parser::new(
            self.parser.screen().size().rows,
            self.parser.screen().size().cols,
            1000
        );
    }
    
    // Command implementations
    fn cmd_echo(&self, args: &[&str]) -> Result<String, String> {
        Ok(format!("{}\n", args.join(" ")))
    }
    
    fn cmd_pwd(&self) -> Result<String, String> {
        Ok(format!("{}\n", self.current_directory))
    }
    
    fn cmd_cd(&mut self, path: Option<&str>) -> Result<String, String> {
        match path {
            Some(p) => {
                if p.starts_with('/') {
                    self.current_directory = p.to_string();
                } else if p == ".." {
                    if let Some(last_slash) = self.current_directory.rfind('/') {
                        if last_slash > 0 {
                            self.current_directory = self.current_directory[..last_slash].to_string();
                        } else {
                            self.current_directory = "/".to_string();
                        }
                    }
                } else if p != "." {
                    if self.current_directory == "/" {
                        self.current_directory = format!("/{}", p);
                    } else {
                        self.current_directory = format!("{}/{}", self.current_directory, p);
                    }
                }
                Ok(String::new())
            }
            None => {
                if let Some(home) = self.environment.get("HOME") {
                    self.current_directory = home.clone();
                    Ok(String::new())
                } else {
                    self.current_directory = "/".to_string();
                    Ok(String::new())
                }
            }
        }
    }
    
    fn cmd_ls(&self, _path: Option<&str>) -> Result<String, String> {
        // Simulated file listing
        Ok("file1.txt  file2.rs  directory/  script.sh\n".to_string())
    }
    
    fn cmd_cat(&self, file: Option<&str>) -> Result<String, String> {
        match file {
            Some(f) => Ok(format!("Contents of {}\n", f)),
            None => Err("cat: missing file operand".to_string()),
        }
    }
    
    fn cmd_mkdir(&self, dir: Option<&str>) -> Result<String, String> {
        match dir {
            Some(d) => Ok(format!("Created directory: {}\n", d)),
            None => Err("mkdir: missing operand".to_string()),
        }
    }
    
    fn cmd_rm(&self, file: Option<&str>) -> Result<String, String> {
        match file {
            Some(f) => Ok(format!("Removed: {}\n", f)),
            None => Err("rm: missing operand".to_string()),
        }
    }
    
    fn cmd_touch(&self, file: Option<&str>) -> Result<String, String> {
        match file {
            Some(f) => Ok(format!("Created/updated: {}\n", f)),
            None => Err("touch: missing file operand".to_string()),
        }
    }
    
    fn cmd_env(&self) -> Result<String, String> {
        let mut output = String::new();
        for (key, value) in &self.environment {
            output.push_str(&format!("{}={}\n", key, value));
        }
        Ok(output)
    }
    
    fn cmd_export(&mut self, var: Option<&str>) -> Result<String, String> {
        match var {
            Some(v) => {
                if let Some(eq_pos) = v.find('=') {
                    let key = v[..eq_pos].to_string();
                    let value = v[eq_pos + 1..].to_string();
                    self.environment.insert(key, value);
                    Ok(String::new())
                } else {
                    Err("export: invalid format (use KEY=VALUE)".to_string())
                }
            }
            None => {
                // Show all exports
                self.cmd_env()
            }
        }
    }
    
    fn cmd_history(&self) -> Result<String, String> {
        let mut output = String::new();
        for (i, cmd) in self.command_history.iter().enumerate() {
            output.push_str(&format!("{:4} {}\n", i + 1, cmd));
        }
        Ok(output)
    }
    
    fn cmd_clear(&self) -> Result<String, String> {
        // ANSI escape sequence to clear screen
        Ok("\x1b[2J\x1b[H".to_string())
    }
    
    fn cmd_help(&self) -> Result<String, String> {
        Ok(r#"Available commands:
  echo [text]    - Display text
  pwd            - Print working directory
  cd [dir]       - Change directory
  ls [dir]       - List directory contents
  cat [file]     - Display file contents
  mkdir [dir]    - Create directory
  rm [file]      - Remove file
  touch [file]   - Create/update file
  env            - Show environment variables
  export KEY=VAL - Set environment variable
  history        - Show command history
  clear          - Clear terminal
  help           - Show this help message
"#.to_string())
    }
}