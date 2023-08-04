use std::net::SocketAddr;

use axum::routing::get;
use axum::{handler::HandlerWithoutStateExt, http::StatusCode, routing::get, Router};
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};

mod errors;

mod routes;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root))
        .merge(routes::shop::create_route());

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();

    tokio::join!(serve(using_serve_dir(), 3001));
}

async fn root() -> String {
    return "Its online!".to_string();
}

async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
fn using_serve_dir() -> Router {
    // serve the file in the "assets" directory under `/assets`
    Router::new().nest_service("/assets", ServeDir::new("assets"))
}
