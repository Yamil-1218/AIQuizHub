# app/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Form(Base):
    __tablename__ = "forms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)

    questions = relationship("Question", back_populates="form")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"))
    text = Column(Text)
    type = Column(String(50))  # e.g., "text", "multiple_choice"

    form = relationship("Form", back_populates="questions")
