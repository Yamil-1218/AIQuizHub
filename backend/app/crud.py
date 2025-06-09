# app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas

def create_form(db: Session, form_data: schemas.FormCreate):
    form = models.Form(title=form_data.title, description=form_data.description)
    db.add(form)
    db.commit()
    db.refresh(form)

    for q in form_data.questions:
        question = models.Question(text=q.text, type=q.type, form_id=form.id)
        db.add(question)

    db.commit()
    db.refresh(form)
    return form
