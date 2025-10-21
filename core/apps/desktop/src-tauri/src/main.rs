// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod error;
mod utils;

use commands::*;
use error::Result;
use tauri::{Manager, State};
use std::sync::Mutex;

pub type AppState = Mutex<AppData>;

#[derive(Debug, Default)]
pub struct AppData {
    pub theme: String,
    pub window_state: serde_json::Value,
}

fn main() {
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_window_state::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_deep_link::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_app_info,
            set_theme,
            get_theme,
            show_notification,
            open_file_dialog,
            save_file_dialog,
            read_file,
            write_file,
            get_system_info,
            check_for_updates,
            relaunch_app,
            exit_app
        ])
        .setup(|app| {
            // Initialize deep link handling
            #[cfg(debug_assertions)]
            {
                let app_handle = app.handle().clone();
                app.listen("deep-link://new-url", move |event| {
                    let url = event.payload().unwrap_or_default();
                    println!("Deep link received: {}", url);
                    // Handle deep link URLs
                    app_handle.emit("deep-link-received", url).unwrap();
                });
            }

            // Set up window state restoration
            let window = app.get_webview_window("main").unwrap();
            
            // Configure window behavior
            window.on_window_event(|event| match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    // Prevent close and hide to tray instead
                    #[cfg(not(target_os = "macos"))]
                    {
                        api.prevent_close();
                        window.hide().unwrap();
                    }
                }
                _ => {}
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
