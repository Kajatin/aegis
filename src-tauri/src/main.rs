// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use tauri_plugin_sql::{Migration, MigrationKind};

mod commands;

#[cfg(target_os = "macos")]
use window_ext::WindowExt;
#[cfg(target_os = "macos")]
mod window_ext;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(target_os = "macos")]
            let main_window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            main_window.position_traffic_lights(13.0, 18.2); // set inset for traffic lights (macos)

            Ok(())
        })
        .on_window_event(|e| {
            #[cfg(target_os = "macos")]
            let apply_offset = || {
                let win = e.window();
                // keep inset for traffic lights when window resize (macos)
                win.position_traffic_lights(13.0, 18.2);
            };
            #[cfg(target_os = "macos")]
            match e.event() {
                WindowEvent::Resized(..) => apply_offset(),
                WindowEvent::ThemeChanged(..) => apply_offset(),
                _ => {}
            }
        })
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:aegis.db",
                    vec![Migration {
                        version: 20230729134143,
                        description: "baseline",
                        sql: include_str!("../migrations/20230729134143_baseline.sql"),
                        kind: MigrationKind::Up,
                    }],
                )
                .build(),
        )
        .plugin(
            tauri_plugin_stronghold::Builder::new(|password| {
                let config = argon2::Config {
                    lanes: 2,
                    mem_cost: 10_000,
                    time_cost: 10,
                    thread_mode: argon2::ThreadMode::from_threads(2),
                    variant: argon2::Variant::Argon2id,
                    ..Default::default()
                };

                let salt = b"some_long_and_secure_random_salt";
                let key = argon2::hash_raw(
                    password.as_ref(),
                    salt,
                    &config,
                )
                .expect("failed to hash password");

                key.to_vec()
            })
            .build(),
        )
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit_all("single-instance", Payload { args: argv, cwd })
                .unwrap();
        }))
        .invoke_handler(tauri::generate_handler![commands::generate_totp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
