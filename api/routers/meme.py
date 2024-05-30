from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection
from models.meme import MemeCreate, MemeEdit, MemeData
from models.user import User
from database.mongodb import connect_to_mongo
from routers.user import get_current_user
from utils.services.firebase import upload_file
from utils.helpers import JWTBearer
from datetime import datetime
import starlette.status as status
from pymongo import DESCENDING
from bson.objectid import ObjectId

from typing import Text, Optional, Dict
import re
import os
import uuid


router = APIRouter()

FILE_PATH = "static/memes"


@router.post("/meme/create", response_model=MemeData, dependencies=[Depends(JWTBearer())])
async def create_meme(
    meme_file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    filename = f"{str(uuid.uuid4())}_{meme_file.filename}"

    file_path = os.path.join(FILE_PATH, filename)
    with open(file_path, "wb") as f:
        content = await meme_file.read()
        f.write(content)

    meme_data = {
        "meme_link": upload_file(file_path),
        "created_by": str(user.username),
        "created_at": datetime.now(),
        "updated_at": None
    }

    result = await collection.insert_one(meme_data)

    if result.inserted_id:
        return MemeData(
            id=str(result.inserted_id),
            meme_link=meme_data["meme_link"],
            created_by=meme_data["created_by"],
            created_at=meme_data["created_at"],
            updated_at=meme_data["updated_at"]
        )

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Erreur lors de l'enregistrement")

"""
@router.put("/meme/edit/{meme_id}", response_model=dict, dependencies=[Depends(JWTBearer())])
async def edit_meme(
    meme_id: str,
    meme: MemeEdit,
    user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    existing = await collection.find_one({"_id": ObjectId(meme_id), "created_by": user.email})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ce meme n'a pas été trouvé")

    meme_data = meme.dict()
    updated_at = datetime.now()

    result = await collection.update_one(
        {"_id": ObjectId(meme_id)},
        {
            "$set": {
                **meme_data,
                "updated_at": updated_at
            }
        }
    )

    if result.matched_count > 0:
        return {"detail": "Mis à jour avec succès"}

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Une erreur s'est produite lors de la mise à jour.")
"""

@router.get("/memes/all", response_model=list[MemeData], dependencies=[Depends(JWTBearer())])
async def get_all_memes(
    start: int,
    end: int,
    user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    if start < 0 or end < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="start ou end doivent être positifs")

    memes = await collection.find({"created_by": user.username}
                                  ).sort("created_at", DESCENDING
                                         ).skip(start).limit(end).to_list(length=None)

    formatted_data = [
        MemeData(
            id=str(ObjectId(meme["_id"])),
            meme_link=meme["meme_link"],
            created_by=meme["created_by"],
            created_at=meme["created_at"],
            updated_at=meme["updated_at"]
        )
        for meme in memes
    ]

    return formatted_data

@router.get("/memes/public", response_model=list[MemeData])
async def get_public_memes(
    start: int,
    end: int,
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    if start < 0 or end < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="start ou end doivent être positifs")

    memes = await collection.find().sort("created_at", DESCENDING
                                         ).skip(start).limit(end).to_list(length=None)

    formatted_data = [
        MemeData(
            id=str(ObjectId(meme["_id"])),
            meme_link=meme["meme_link"],
            created_by=meme["created_by"],
            created_at=meme["created_at"],
            updated_at=meme["updated_at"]
        )
        for meme in memes
    ]

    return formatted_data



@router.get("/meme/{meme_id}", response_model=MemeData, dependencies=[Depends(JWTBearer())])
async def get_meme_detail(
    meme_id: str,
    user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    meme = await collection.find_one({"_id": ObjectId(meme_id), "created_by": user.username})

    if not meme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ce meme n'a pas été trouvé")

    formatted_data = MemeData(
        id=str(ObjectId(meme["_id"])),
        meme_link=meme["meme_link"],
        created_by=meme["created_by"],
        created_at=meme["created_at"],
        updated_at=meme["updated_at"]
    )

    return formatted_data


@router.delete("/meme/{meme_id}", response_model=dict, dependencies=[Depends(JWTBearer())])
async def delete_meme(
    meme_id: str,
    user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(connect_to_mongo)
):

    collection: AsyncIOMotorCollection = db["memes"]

    meme = await collection.find_one({"_id": ObjectId(meme_id), "created_by": user.email})

    if not meme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ce meme n'a pas été trouvé")

    await collection.delete_one({"_id": ObjectId(meme_id)})

    return {"detail": "Supprimé avec succès"}
