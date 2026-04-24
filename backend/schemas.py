from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    title: str

class ResumeCreate(ResumeBase):
    pass

class Resume(ResumeBase):
    id: int
    filename: Optional[str]
    created_at: datetime.datetime
    owner_id: int

    class Config:
        from_attributes = True

class Analysis(BaseModel):
    id: int
    ats_score: int
    missing_keywords: str
    skill_gaps: str
    formatting_feedback: str
    suggested_improvements: str
    resume_id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
