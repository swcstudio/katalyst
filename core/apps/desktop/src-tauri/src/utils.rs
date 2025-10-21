pub mod platform;
pub mod file;
pub mod system;

use std::path::PathBuf;

/// Get the user's home directory
pub fn get_home_dir() -> Option<PathBuf> {
    dirs::home_dir()
}

/// Get the user's documents directory
pub fn get_documents_dir() -> Option<PathBuf> {
    dirs::document_dir()
}

/// Get the user's downloads directory
pub fn get_downloads_dir() -> Option<PathBuf> {
    dirs::download_dir()
}

/// Get the application data directory
pub fn get_app_data_dir() -> Option<PathBuf> {
    dirs::data_dir()
}

/// Format file size in human readable format
pub fn format_file_size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    let mut size = bytes as f64;
    let mut unit_index = 0;
    
    while size >= 1024.0 && unit_index < UNITS.len() - 1 {
        size /= 1024.0;
        unit_index += 1;
    }
    
    if unit_index == 0 {
        format!("{} {}", bytes, UNITS[unit_index])
    } else {
        format!("{:.1} {}", size, UNITS[unit_index])
    }
}

/// Generate a unique ID
pub fn generate_id() -> String {
    uuid::Uuid::new_v4().to_string()
}

/// Get current timestamp
pub fn current_timestamp() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
