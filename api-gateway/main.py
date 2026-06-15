from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPRING_BOOT_URL = "http://localhost:8081"


def forward_json(response: Response, backend_response):
    response.status_code = backend_response.status_code
    if backend_response.content:
        try:
            return backend_response.json()
        except Exception:
            return {}
    return {}


def auth_headers(request: Request):
    token = request.headers.get("authorization")
    if token:
        return {"Authorization": token}
    return {}


@app.get("/jobs")
def get_jobs(request: Request, response: Response):
    backend_response = requests.get(
        f"{SPRING_BOOT_URL}/jobs",
        headers=auth_headers(request),
    )
    return forward_json(response, backend_response)


@app.post("/jobs")
def create_job(job: dict, request: Request, response: Response):
    backend_response = requests.post(
        f"{SPRING_BOOT_URL}/jobs",
        json=job,
        headers=auth_headers(request),
    )
    return forward_json(response, backend_response)


@app.post("/auth/register")
def register_user(user: dict, response: Response):
    backend_response = requests.post(f"{SPRING_BOOT_URL}/auth/register", json=user)
    return forward_json(response, backend_response)


@app.post("/auth/login")
def login_user(user: dict, response: Response):
    backend_response = requests.post(f"{SPRING_BOOT_URL}/auth/login", json=user)
    return forward_json(response, backend_response)


@app.post("/applications/apply")
def apply_job(data: dict, request: Request, response: Response):
    backend_response = requests.post(
        f"{SPRING_BOOT_URL}/applications/apply",
        json=data,
        headers=auth_headers(request),
    )
    return forward_json(response, backend_response)


@app.get("/applications/user/{user_id}")
def get_user_applications(user_id: int, request: Request, response: Response):
    backend_response = requests.get(
        f"{SPRING_BOOT_URL}/applications/user/{user_id}",
        headers=auth_headers(request),
    )
    return forward_json(response, backend_response)


@app.delete("/applications/{application_id}")
def delete_application(application_id: int, request: Request, response: Response):
    backend_response = requests.delete(
        f"{SPRING_BOOT_URL}/applications/{application_id}",
        headers=auth_headers(request),
    )
    return forward_json(response, backend_response)
