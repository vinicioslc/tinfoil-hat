use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde_json::json;
use tokio::task::JoinError;

#[derive(thiserror::Error, Debug)]
#[error("...")]
pub enum Error {
    #[error("Error parsing ObjectID {0}")]
    ParseObjectID(String),

    #[error("{0}")]
    Authenticate(#[from] AuthenticateError),

    #[error("{0}")]
    BadRequest(#[from] BadRequest),

    #[error("{0}")]
    NotFound(#[from] NotFound),

    #[error("{0}")]
    RunSyncTask(#[from] JoinError),

    #[error("{0}")]
    InternalError(#[from] InternalError),
}

#[derive(thiserror::Error, Debug)]
#[error("...")]
pub enum AuthenticateError {
    #[error("Wrong authentication credentials")]
    WrongCredentials,
    #[error("Failed to create authentication token")]
    TokenCreation,
    #[error("Invalid authentication credentials")]
    InvalidToken,
    #[error("User is locked")]
    Locked,
}

#[derive(thiserror::Error, Debug)]
#[error("...")]
pub enum InternalError {
    #[error("Unknown Internal Error")]
    UnknownInternalError,
}

impl Error {
    fn get_codes(&self) -> (StatusCode, u16) {
        match *self {
            // 4XX Errors
            Error::ParseObjectID(_) => (StatusCode::BAD_REQUEST, 40001),
            Error::BadRequest(_) => (StatusCode::BAD_REQUEST, 40002),
            Error::NotFound(_) => (StatusCode::NOT_FOUND, 40003),
            Error::Authenticate(AuthenticateError::WrongCredentials) => {
                (StatusCode::UNAUTHORIZED, 40004)
            }
            Error::Authenticate(AuthenticateError::InvalidToken) => {
                (StatusCode::UNAUTHORIZED, 40005)
            }
            Error::Authenticate(AuthenticateError::Locked) => (StatusCode::LOCKED, 40006),

            // 5XX Errors
            Error::Authenticate(AuthenticateError::TokenCreation) => {
                (StatusCode::INTERNAL_SERVER_ERROR, 5001)
            }
            Error::RunSyncTask(_) => (StatusCode::INTERNAL_SERVER_ERROR, 5005),

            Error::InternalError(InternalError::UnknownInternalError) => {
                (StatusCode::INTERNAL_SERVER_ERROR, 5001)
            }
        }
    }

    pub fn bad_request() -> Self {
        Error::BadRequest(BadRequest {})
    }
    pub fn internal_error() -> Self {
        Error::BadRequest(BadRequest {})
    }

    pub fn not_found() -> Self {
        Error::NotFound(NotFound {})
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let (status_code, code) = self.get_codes();
        let message = self.to_string();
        let body = Json(json!({ "code": code, "message": message }));

        (status_code, body).into_response()
    }
}

#[derive(thiserror::Error, Debug)]
#[error("Bad Request")]
pub struct BadRequest {}

#[derive(thiserror::Error, Debug)]
#[error("Not found")]
pub struct NotFound {}

#[derive(thiserror::Error, Debug)]
#[error("Internal Error")]
pub struct UnknownInternalError {}
