from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.apis.v1.router import appuser_router, auth_router
from fastapi.staticfiles import StaticFiles
import settings
import uvicorn
import logging


app = FastAPI(title='Learning English')


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appuser_router, prefix='/api/v1')
app.include_router(auth_router, prefix='/api/v1')

app.mount(settings.STATIC_DIR, StaticFiles(directory="static"), name="static")

@app.on_event("startup")
def on_startup():
    logging.config.dictConfig(settings.LOGGING)


@app.get("/ping/")
async def ping() -> dict:
    return {"ping": "pong"}


if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
