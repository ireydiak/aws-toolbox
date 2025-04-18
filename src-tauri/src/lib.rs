use aws_config::BehaviorVersion;
use aws_sdk_cloudwatchlogs::Client as CloudWatchClient;
use aws_sdk_lambda::Client as LambdaClient;
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::{App, AppHandle, State};
use tauri_plugin_store::{StoreExt};
use tokio::sync::Mutex;

struct AppState {
    lambda_client: Mutex<Option<LambdaClient>>,
    cloudwatch_client: Mutex<Option<CloudWatchClient>>,
    profile: Mutex<Option<String>>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct LambdaFunction {
    name: String,
    memory: i32,
    runtime: String,
    last_modified: String,
    timeout: i32,
    log_group: Option<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct LogEvent {
    timestamp: i64,
    message: String,
    ingestion_time: i64,
}

#[tauri::command]
async fn list_lambda_functions(state: State<'_, AppState>) -> Result<Vec<LambdaFunction>, String> {
    let guard = state.lambda_client.lock().await;
    let client = guard
        .as_ref()
        .ok_or_else(|| String::from("Not logged in. Please login first."))?;

    let resp = client
        .list_functions()
        .send()
        .await
        .map_err(|e| format!("failed to list functions {}", e))?;

    let lambdas = resp.functions();

    let result = lambdas
        .iter()
        .map(|lambda| LambdaFunction {
            name: lambda.function_name().unwrap_or_default().to_string(),
            memory: lambda.memory_size().unwrap_or_default(),
            runtime: lambda
                .runtime()
                .map(|r| r.as_str())
                .unwrap_or_default()
                .to_string(),
            timeout: lambda.timeout().unwrap_or_default(),
            last_modified: lambda.last_modified().unwrap_or_default().to_string(),
            log_group: lambda
                .logging_config()
                .and_then(|config| config.log_group())
                .map(|group| group.to_string()),
        })
        .collect();

    Ok(result)
}

#[tauri::command]
async fn list_function_logs(
    log_group_name: &str,
    state: State<'_, AppState>,
) -> Result<Vec<LogEvent>, String> {
    let guard = state.cloudwatch_client.lock().await;
    let client = guard
        .as_ref()
        .ok_or_else(|| "Not logged in. Please login first.")?;

    let resp = client
        .get_log_events()
        .log_group_name(log_group_name)
        .log_stream_name("2025/04/09/[$LATEST]89b6507830a1400c85018390f78e88d8")
        .limit(100)
        .send()
        .await
        .map_err(|e| {
            format!(
                "failed to get log events for log group named {}: {}",
                log_group_name, e
            )
        })?;

    let events = resp
        .events()
        .iter()
        .map(|event| LogEvent {
            timestamp: event.timestamp.unwrap_or_default(),
            message: event.message().unwrap_or_default().to_string(),
            ingestion_time: event.ingestion_time.unwrap_or_default(),
        })
        .collect();
    Ok(events)
}

#[tauri::command]
async fn login_aws_profile(profile: &str, state: State<'_, AppState>) -> Result<String, String> {
    let output = Command::new("aws")
        .args(["sso", "login", "--profile", profile])
        .output()
        .map_err(|e| format!("Failed to login to profile {}: {}", profile, e))?;

    if !output.status.success() {
        return Err(format!(
            "Login failed {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    let config = aws_config::defaults(BehaviorVersion::v2025_01_17())
        .profile_name(profile)
        .load()
        .await;

    let lambda_client = LambdaClient::new(&config);
    let cloudwatch_client = CloudWatchClient::new(&config);

    *state.lambda_client.lock().await = Some(lambda_client);
    *state.cloudwatch_client.lock().await = Some(cloudwatch_client);
    *state.profile.lock().await = Some(profile.to_string());

    Ok(format!("Successfully logged in to {}", profile).to_string())
}

#[tauri::command]
fn list_aws_profiles(app_handle: AppHandle) -> Result<Vec<String>, String> {
    let store = app_handle.store("settings.json")
        .map_err(|e| format!("Failed getting store: {}", e))?;

    let cfg_path = match store.get("AWS_CONFIG_LOCATION") {
        Some(value) => match value.as_str() {
            Some(path) => path.to_string(),
            None => return Err("AWS config location is not a string or does not exist".to_string())
        },
        None => return Err("AWS_CONFIG_LOCATION is not set in preferences".to_string())
    };

    if !std::path::Path::new(&cfg_path).exists() {
        return Err(format!("AWS config file does not exist at: {}", cfg_path));
    }

    let content = std::fs::read_to_string(&cfg_path)
        .map_err(|e| format!("Reading config file {} failed with {}", cfg_path, e))?;

    let mut profiles = Vec::new();
    for line in content.lines() {
        if line.trim().starts_with("[profile ") && line.contains("]") {
            let start = line.find("[profile ").unwrap() + 9;
            let end = line.find("]").unwrap();
            profiles.push(line[start..end].trim().to_string());
        }
    }

    Ok(profiles)
}

fn default_aws_config_location() -> Result<String, String> {
    dirs::home_dir()
        .ok_or_else(|| "Failed getting home directory".to_string())
        .map(|home| home.join(".aws").join("config").to_string_lossy().to_string())
}

fn init_store(app: &mut App) -> Result<(), String> {
    println!("init_store called");
    let store = app.store("settings.json")
        .map_err(|e| format!("Failed to access store: {}", e))?;

    println!("store loaded {}", store.has("AWS_CONFIG_LOCATION"));
    if !store.has("AWS_CONFIG_LOCATION") {
        println!("store does not have key");
        let location = default_aws_config_location()
            .unwrap_or_default();
        println!("location: {}", location.clone().to_string());
        store.set("AWS_CONFIG_LOCATION", location.to_string());
        store.save().map_err(|e| format!("Failed to save configuration file: {}", e))?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(AppState {
            lambda_client: Mutex::new(None),
            cloudwatch_client: Mutex::new(None),
            profile: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            list_aws_profiles,
            login_aws_profile,
            list_lambda_functions,
            list_function_logs,
        ])
        .setup(|app| {
            if let Err(e) = init_store(app) {
                println!("Store initialization failed: {}", e)
            }
            Ok(())

        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
