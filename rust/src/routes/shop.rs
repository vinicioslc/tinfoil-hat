use glob::glob;
use serde_json::Value;
use std::{
    any, env, fs,
    path::{Path, PathBuf},
};

use axum::{routing::get, Router};

use crate::errors::{Error, InternalError};

pub fn create_route() -> Router {
    Router::new().route("/shop.json", get(shop_json))
}

async fn shop_json() -> Result<String, Error> {
    let mut template = env::current_dir().unwrap();
    template.push("shop_template.jsonc");
    println!("opened: {}", template.to_str().unwrap());

    match fs::read_to_string(template) {
        Ok(current_content) => {
            println!("total characters: {}", current_content.len());
            let stringuee = current_content.as_str();
            match json5::from_str::<serde_json::Value>(stringuee) {
                Ok(parsed_template) => {
                    return Ok(build_json(parsed_template).await);
                }
                Err(e) => {
                    println!("Erro ao ler o arquivo: {}", e);
                    return Err(Error::bad_request());
                }
            };
        }
        Err(e) => {
            // Lidando com o caso de erro
            // Você pode adicionar aqui o código para lidar com o erro
            println!("Erro ao ler o arquivo: {}", e);
            return Err(Error::internal_error());
        }
    }
}

pub struct TinfoilResponse {
    directories: Vec<PathBuf>,
    files: Vec<PathBuf>,
}

async fn list_roms_files() -> Result<TinfoilResponse, Error> {
    let mut dirs: Vec<PathBuf> = Vec::new();
    let mut files: Vec<PathBuf> = Vec::new();
    let path_to_search = env::current_dir()
        .unwrap()
        .join("**/games/**/*.*")
        .to_str()
        .unwrap_or("")
        .to_string();
    for entry in glob(&path_to_search)
        .expect("Failed to read glob pattern")
        .filter_map(Result::ok)
    {
        if entry.is_dir() {
            dirs.push(entry);
        } else if entry.is_file() && !entry.ends_with("nsz") {
            files.push(entry);
        }
    }
    return Ok(TinfoilResponse {
        directories: dirs,
        files: files,
    });
}

async fn build_json(parsed_template: Value) -> String {
    let files_found = list_roms_files().await.unwrap();
    println!("listed files: {:?}", files_found.files);
    println!("listed directories: {:?}", files_found.directories);
    let mut template = parsed_template;
    template["directories"] = serde_json::json!(files_found.directories);
    template["files"] = serde_json::json!(files_found.files);
    let json_output = serde_json::to_string(&template).unwrap();
    println!("file content: {}", json_output);
    return json_output;
}
