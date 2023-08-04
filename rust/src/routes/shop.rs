use glob::glob;
use serde_json::Value;
use std::collections::HashMap;
use std::{fs, path::PathBuf};

use axum::{routing::get, Router};

use crate::errors::Error;

pub fn create_route() -> Router {
    Router::new().route("/shop.json", get(shop_json))
}

async fn shop_json() -> Result<String, Error> {
    let mut template_json_path = std::env::current_dir().unwrap();
    template_json_path.push("shop_template.jsonc");
    println!("opened: {}", template_json_path.to_str().unwrap());

    match fs::read_to_string(template_json_path) {
        Ok(current_content) => {
            println!("total characters: {}", current_content.len());
            let template_string = current_content.as_str();
            match json5::from_str::<serde_json::Value>(template_string) {
                Ok(template_parsed) => {
                    return Ok(build_json(template_parsed).await);
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
    let mut folders_list: [char; 0] = [];
    let xci_path = std::env::current_dir()
        .unwrap()
        .join("**/games/**/*.xci")
        .to_str()
        .unwrap_or("")
        .to_string();
    let nsz_path = std::env::current_dir()
        .unwrap()
        .join("**/games/**/*.nsz")
        .to_str()
        .unwrap_or("")
        .to_string();
    for file_name_result in glob(&xci_path)
        .unwrap()
        .chain(glob(&nsz_path).unwrap())
    {
        match file_name_result {
            Ok(file_path) => {
                if file_path.is_dir() {
                    dirs.push(file_path);
                } else if file_path.is_file() && !file_path.ends_with("nsz") {
                    files.push(file_path);
                }
            }
            Err(e) => {
                eprintln!("ERROR FILE SEARCH: {}", e)
            }
        }
    }
    return Ok(TinfoilResponse {
        directories: dirs,
        files: files,
    });
}

async fn build_json(parsed_template: Value) -> String {
    let files_found = list_roms_files().await.unwrap();
    println!("");
    println!("listed files: {:?}", files_found.files);
    println!("");
    println!("listed directories: {:?}", files_found.directories);
    println!("");
    let mut template = parsed_template;
    template["directories"] = serde_json::json!(files_found.directories);
    template["files"] = serde_json::json!(files_found.files);
    let json_output = serde_json::to_string(&template).unwrap();
    println!("file content: {}", json_output);
    return json_output;
}
