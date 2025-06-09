# app/schemas.py
from pydantic import BaseModel
from typing import List, Optional

class QuestionCreate(BaseModel):
    text: str
    type: str

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[QuestionCreate]

class Question(BaseModel):
    id: int
    text: str
    type: str

    class Config:
        orm_mode = True

class Form(BaseModel):
    id: int
    title: str
    description: Optional[str]
    questions: List[Question]

    class Config:
        orm_mode = True
