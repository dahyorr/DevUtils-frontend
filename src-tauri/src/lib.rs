#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tauri::command]
fn get_app_dir() {
    // let mut path = dirs::config_dir().unwrap();
    // path.push("app_name");
    // path
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_app_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
