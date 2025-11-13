#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use katalyst_tui::App as TuiApp;
use std::sync::Arc;
use tauri::{
    async_runtime::spawn,
    CustomMenuItem, GlobalShortcutManager, Manager, Menu, MenuItem, Submenu, SystemTray,
    SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};
use tokio::sync::RwLock;

mod commands;
mod notifications;
mod terminal_view;

use commands::*;
use notifications::NotificationService;
use terminal_view::TerminalView;

fn main() {
    // Build Tauri application
    tauri::Builder::default()
        .setup(|app| {
            // Initialize terminal view
            let terminal_view = Arc::new(RwLock::new(TerminalView::new()));
            app.manage(terminal_view.clone());
            
            // Initialize notification service
            let notification_service = Arc::new(NotificationService::new());
            app.manage(notification_service.clone());
            
            // Set up global shortcuts
            let mut shortcut_manager = app.global_shortcut_manager();
            
            // Register global shortcuts
            shortcut_manager
                .register("CmdOrCtrl+Shift+P", move || {
                    // Open command palette
                })
                .unwrap();
            
            shortcut_manager
                .register("CmdOrCtrl+Shift+F", move || {
                    // Global search
                })
                .unwrap();
            
            // Initialize TUI app in background
            let tui_app = Arc::new(RwLock::new(
                tauri::async_runtime::block_on(TuiApp::new(Default::default())).unwrap()
            ));
            app.manage(tui_app);
            
            // Create main window
            let main_window = app.get_window("main").unwrap();
            
            // Set up window state persistence
            tauri_plugin_window_state::Builder::default()
                .build()
                .init(&main_window);
            
            Ok(())
        })
        .menu(build_menu())
        .system_tray(build_system_tray())
        .on_system_tray_event(handle_system_tray_event)
        .on_window_event(handle_window_event)
        .invoke_handler(tauri::generate_handler![
            // Terminal commands
            execute_command,
            get_terminal_output,
            send_terminal_input,
            resize_terminal,
            
            // File operations
            open_file,
            save_file,
            create_file,
            delete_file,
            
            // LSP commands
            get_completions,
            get_hover_info,
            goto_definition,
            find_references,
            rename_symbol,
            
            // Search commands
            search_in_files,
            search_symbols,
            
            // WASM commands
            load_wasm_module,
            execute_wasm_function,
            
            // Notification commands
            show_notification,
            
            // Settings
            get_settings,
            update_settings,
        ])
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::init())
        .plugin(tauri_plugin_window_state::init())
        .plugin(tauri_plugin_updater::init())
        .plugin(tauri_plugin_process::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn build_menu() -> Menu {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let new_file = CustomMenuItem::new("new_file".to_string(), "New File");
    let open_file = CustomMenuItem::new("open_file".to_string(), "Open File");
    let save_file = CustomMenuItem::new("save_file".to_string(), "Save File");
    
    let file_menu = Submenu::new(
        "File",
        Menu::new()
            .add_item(new_file)
            .add_item(open_file)
            .add_item(save_file)
            .add_native_item(MenuItem::Separator)
            .add_item(close)
            .add_item(quit),
    );
    
    let copy = CustomMenuItem::new("copy".to_string(), "Copy");
    let paste = CustomMenuItem::new("paste".to_string(), "Paste");
    let cut = CustomMenuItem::new("cut".to_string(), "Cut");
    
    let edit_menu = Submenu::new(
        "Edit",
        Menu::new()
            .add_item(cut)
            .add_item(copy)
            .add_item(paste),
    );
    
    let toggle_fullscreen = CustomMenuItem::new("toggle_fullscreen".to_string(), "Toggle Fullscreen");
    let zoom_in = CustomMenuItem::new("zoom_in".to_string(), "Zoom In");
    let zoom_out = CustomMenuItem::new("zoom_out".to_string(), "Zoom Out");
    
    let view_menu = Submenu::new(
        "View",
        Menu::new()
            .add_item(toggle_fullscreen)
            .add_native_item(MenuItem::Separator)
            .add_item(zoom_in)
            .add_item(zoom_out),
    );
    
    let new_terminal = CustomMenuItem::new("new_terminal".to_string(), "New Terminal");
    let split_horizontal = CustomMenuItem::new("split_horizontal".to_string(), "Split Horizontal");
    let split_vertical = CustomMenuItem::new("split_vertical".to_string(), "Split Vertical");
    
    let terminal_menu = Submenu::new(
        "Terminal",
        Menu::new()
            .add_item(new_terminal)
            .add_item(split_horizontal)
            .add_item(split_vertical),
    );
    
    Menu::new()
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(view_menu)
        .add_submenu(terminal_menu)
}

fn build_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    
    SystemTray::new().with_menu(tray_menu)
}

fn handle_system_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            let window = app.get_window("main").unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "hide" => {
                let window = app.get_window("main").unwrap();
                window.hide().unwrap();
            }
            "show" => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}

fn handle_window_event(event: GlobalWindowEvent) {
    match event.event() {
        WindowEvent::CloseRequested { api, .. } => {
            // Handle close event
        }
        WindowEvent::Resized(size) => {
            // Handle resize
        }
        WindowEvent::Focused(focused) => {
            // Handle focus change
        }
        _ => {}
    }
}