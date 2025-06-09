from fastapi import FastAPI
from .routers import forms

app = FastAPI()

app.include_router(forms.router, prefix="/api/forms")
