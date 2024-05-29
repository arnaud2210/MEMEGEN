from fastapi import FastAPI
from routers import user, meme
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import config
import os
import sys



app = FastAPI(swagger_ui_parameters={"syntaxHighlight.theme": "vs"})
static_path = os.path.dirname(__file__) + "/static"
templates_path = os.path.dirname(__file__) + "/templates"

if getattr(sys, 'frozen', False):
    static_path = f"{sys._MEIPASS}/static"
    templates_path = f"{sys._MEIPASS}/templates"
    
app.mount("/static", StaticFiles(directory=static_path), name="ui")

@app.get("/")
async def welcome_memegen():
    return {"message":"Bienvenue sur MEMEGEN."}


templates = Jinja2Templates(directory=templates_path)
app.include_router(user.router, prefix="/api/auth", tags=["User"])
app.include_router(meme.router, prefix="/api", tags=["Memes Request"])

origins = ["*"]
app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host=config.SERVER_HOST, port=int(config.API_PORT), reload=True)
