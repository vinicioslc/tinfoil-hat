use axum::routing::get;
use axum::Router;

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
}

async fn root() -> String {
    return "Its online!".to_string();
}
