use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use ropey::Rope;
use tree_sitter::{Parser, Language};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::IDEConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Buffer {
    pub id: String,
    pub path: String,
    pub content: Rope,
    pub language: Option<String>,
    pub dirty: bool,
    pub version: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Cursor {
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Selection {
    pub start: Cursor,
    pub end: Cursor,
}

pub struct Editor {
    config: Arc<RwLock<IDEConfig>>,
    buffers: HashMap<String, Buffer>,
    active_buffer: Option<String>,
    cursor: Cursor,
    selection: Option<Selection>,
    parser: Parser,
    undo_stack: Vec<EditOperation>,
    redo_stack: Vec<EditOperation>,
}

#[derive(Debug, Clone)]
pub enum EditOperation {
    Insert { position: usize, text: String },
    Delete { position: usize, length: usize, deleted_text: String },
    Replace { position: usize, length: usize, old_text: String, new_text: String },
}

impl Editor {
    pub fn new(config: Arc<RwLock<IDEConfig>>) -> Self {
        let mut parser = Parser::new();
        
        Self {
            config,
            buffers: HashMap::new(),
            active_buffer: None,
            cursor: Cursor { line: 0, column: 0 },
            selection: None,
            parser,
            undo_stack: Vec::new(),
            redo_stack: Vec::new(),
        }
    }
    
    pub async fn open_buffer(&mut self, path: &str, content: &str) -> Result<(), String> {
        let rope = Rope::from_str(content);
        let language = detect_language(path);
        
        let buffer = Buffer {
            id: generate_buffer_id(),
            path: path.to_string(),
            content: rope,
            language,
            dirty: false,
            version: 0,
        };
        
        let buffer_id = buffer.id.clone();
        self.buffers.insert(buffer_id.clone(), buffer);
        self.active_buffer = Some(buffer_id);
        self.cursor = Cursor { line: 0, column: 0 };
        
        Ok(())
    }
    
    pub async fn close_buffer(&mut self, buffer_id: &str) -> Result<(), String> {
        if let Some(buffer) = self.buffers.get(buffer_id) {
            if buffer.dirty {
                return Err("Buffer has unsaved changes".to_string());
            }
        }
        
        self.buffers.remove(buffer_id);
        
        if self.active_buffer.as_deref() == Some(buffer_id) {
            self.active_buffer = self.buffers.keys().next().cloned();
        }
        
        Ok(())
    }
    
    pub async fn insert_text(&mut self, text: &str) -> Result<(), String> {
        let buffer_id = self.active_buffer.as_ref()
            .ok_or_else(|| "No active buffer".to_string())?;
        
        let buffer = self.buffers.get_mut(buffer_id)
            .ok_or_else(|| "Buffer not found".to_string())?;
        
        let position = self.cursor_to_position(&buffer.content);
        
        // Store operation for undo
        self.undo_stack.push(EditOperation::Insert {
            position,
            text: text.to_string(),
        });
        self.redo_stack.clear();
        
        // Perform the insertion
        let mut content_str = buffer.content.to_string();
        content_str.insert_str(position, text);
        buffer.content = Rope::from_str(&content_str);
        buffer.dirty = true;
        buffer.version += 1;
        
        // Update cursor position
        self.advance_cursor(text.len());
        
        Ok(())
    }
    
    pub async fn delete_text(&mut self, length: usize) -> Result<(), String> {
        let buffer_id = self.active_buffer.as_ref()
            .ok_or_else(|| "No active buffer".to_string())?;
        
        let buffer = self.buffers.get_mut(buffer_id)
            .ok_or_else(|| "Buffer not found".to_string())?;
        
        let position = self.cursor_to_position(&buffer.content);
        
        if position + length > buffer.content.len_chars() {
            return Err("Delete range exceeds buffer length".to_string());
        }
        
        let mut content_str = buffer.content.to_string();
        let deleted_text = content_str[position..position + length].to_string();
        
        // Store operation for undo
        self.undo_stack.push(EditOperation::Delete {
            position,
            length,
            deleted_text: deleted_text.clone(),
        });
        self.redo_stack.clear();
        
        // Perform the deletion
        content_str.drain(position..position + length);
        buffer.content = Rope::from_str(&content_str);
        buffer.dirty = true;
        buffer.version += 1;
        
        Ok(())
    }
    
    pub async fn undo(&mut self) -> Result<(), String> {
        if let Some(operation) = self.undo_stack.pop() {
            let buffer_id = self.active_buffer.as_ref()
                .ok_or_else(|| "No active buffer".to_string())?;
            
            let buffer = self.buffers.get_mut(buffer_id)
                .ok_or_else(|| "Buffer not found".to_string())?;
            
            match operation.clone() {
                EditOperation::Insert { position, text } => {
                    // Undo insertion by deleting
                    let mut content_str = buffer.content.to_string();
                    content_str.drain(position..position + text.len());
                    buffer.content = Rope::from_str(&content_str);
                }
                EditOperation::Delete { position, deleted_text, .. } => {
                    // Undo deletion by inserting
                    let mut content_str = buffer.content.to_string();
                    content_str.insert_str(position, &deleted_text);
                    buffer.content = Rope::from_str(&content_str);
                }
                EditOperation::Replace { position, length, old_text, .. } => {
                    // Undo replace by restoring old text
                    let mut content_str = buffer.content.to_string();
                    content_str.drain(position..position + length);
                    content_str.insert_str(position, &old_text);
                    buffer.content = Rope::from_str(&content_str);
                }
            }
            
            self.redo_stack.push(operation);
            buffer.version += 1;
        }
        
        Ok(())
    }
    
    pub async fn redo(&mut self) -> Result<(), String> {
        if let Some(operation) = self.redo_stack.pop() {
            let buffer_id = self.active_buffer.as_ref()
                .ok_or_else(|| "No active buffer".to_string())?;
            
            let buffer = self.buffers.get_mut(buffer_id)
                .ok_or_else(|| "Buffer not found".to_string())?;
            
            match operation.clone() {
                EditOperation::Insert { position, text } => {
                    // Redo insertion
                    let mut content_str = buffer.content.to_string();
                    content_str.insert_str(position, &text);
                    buffer.content = Rope::from_str(&content_str);
                }
                EditOperation::Delete { position, length, .. } => {
                    // Redo deletion
                    let mut content_str = buffer.content.to_string();
                    content_str.drain(position..position + length);
                    buffer.content = Rope::from_str(&content_str);
                }
                EditOperation::Replace { position, length, new_text, .. } => {
                    // Redo replace
                    let mut content_str = buffer.content.to_string();
                    content_str.drain(position..position + length);
                    content_str.insert_str(position, &new_text);
                    buffer.content = Rope::from_str(&content_str);
                }
            }
            
            self.undo_stack.push(operation);
            buffer.version += 1;
        }
        
        Ok(())
    }
    
    pub async fn get_buffer_content(&self, buffer_id: &str) -> Result<String, String> {
        self.buffers.get(buffer_id)
            .map(|b| b.content.to_string())
            .ok_or_else(|| "Buffer not found".to_string())
    }
    
    pub async fn set_cursor(&mut self, line: usize, column: usize) {
        self.cursor = Cursor { line, column };
        self.selection = None;
    }
    
    pub async fn set_selection(&mut self, start_line: usize, start_col: usize, end_line: usize, end_col: usize) {
        self.selection = Some(Selection {
            start: Cursor { line: start_line, column: start_col },
            end: Cursor { line: end_line, column: end_col },
        });
    }
    
    fn cursor_to_position(&self, rope: &Rope) -> usize {
        let mut position = 0;
        for i in 0..self.cursor.line.min(rope.len_lines()) {
            position += rope.line(i).len_chars();
        }
        position + self.cursor.column.min(
            if self.cursor.line < rope.len_lines() {
                rope.line(self.cursor.line).len_chars()
            } else {
                0
            }
        )
    }
    
    fn advance_cursor(&mut self, chars: usize) {
        // Simplified cursor advancement
        self.cursor.column += chars;
    }
}

fn detect_language(path: &str) -> Option<String> {
    let extension = path.rsplit('.').next()?;
    
    match extension {
        "rs" => Some("rust".to_string()),
        "js" | "mjs" => Some("javascript".to_string()),
        "ts" | "tsx" => Some("typescript".to_string()),
        "py" => Some("python".to_string()),
        "go" => Some("go".to_string()),
        "c" | "h" => Some("c".to_string()),
        "cpp" | "cc" | "cxx" | "hpp" => Some("cpp".to_string()),
        "java" => Some("java".to_string()),
        "rb" => Some("ruby".to_string()),
        "swift" => Some("swift".to_string()),
        "kt" => Some("kotlin".to_string()),
        "md" => Some("markdown".to_string()),
        "json" => Some("json".to_string()),
        "yaml" | "yml" => Some("yaml".to_string()),
        "toml" => Some("toml".to_string()),
        _ => None,
    }
}

fn generate_buffer_id() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    format!("buffer_{:016x}", rng.gen::<u64>())
}