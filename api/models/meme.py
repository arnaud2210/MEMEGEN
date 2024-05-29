from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class MemeCreate(BaseModel):
    meme_link: str
    created_by: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class MemeEdit(BaseModel):
    meme_link: str

class MemeData(BaseModel):
    id: str
    meme_link: str
    created_by: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]