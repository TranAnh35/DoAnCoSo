from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, register_user, signin_user, get_information, create_guest_session, drop_guest_session, save_image_history, remove_image_history, get_image_history
from pydantic import BaseModel
from typing import Optional
import torch
import cv2
import numpy as np
from base64 import b64encode, b64decode

app = FastAPI()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserSignin(BaseModel):
    username: str
    password: str

class ImageHistoryRequest(BaseModel):
    user_id: Optional[int] = None
    session_id: Optional[int] = None
    input_image: str  # Base64 encoded string
    output_image: str  # Base64 encoded string
    scale: int

class ImageHistoryResponse(BaseModel):
    message: str

@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    user_id, message, success = register_user(db, user.username, user.email, user.password)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"user_id": user_id, "message": message}

@app.post("/signin")
def signin(user: UserSignin, db: Session = Depends(get_db)):
    user_id, message, success = signin_user(db, user.username, user.password)
    if not success:
        raise HTTPException(status_code=401, detail=message)
    return {"user_id": user_id, "message": message}

@app.get("/user/info")
def user_info(user_id: int, info: str = "username", db: Session = Depends(get_db)):
    result = get_information(db, user_id=user_id, info=info)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {info: result}

@app.post("/guest/create")
def create_guest(db: Session = Depends(get_db)):
    session_id, session_token, success = create_guest_session(db)
    return {"session_id": session_id, "session_token": session_token}

@app.delete("/guest/drop")
def drop_guest(session_id: int, db: Session = Depends(get_db)):
    drop_guest_session(db, session_id)
    return {"message": "Guest session dropped"}

@app.post("/image/history/save", response_model=ImageHistoryResponse)
def save_history(request: ImageHistoryRequest, db: Session = Depends(get_db)):
    # Decode base64 images to numpy arrays
    input_bytes = b64decode(request.input_image)
    output_bytes = b64decode(request.output_image)
    
    input_img = cv2.imdecode(np.frombuffer(input_bytes, np.uint8), cv2.IMREAD_COLOR)
    output_img = cv2.imdecode(np.frombuffer(output_bytes, np.uint8), cv2.IMREAD_COLOR)
    
    # TODO: Add super-resolution processing here if needed
    # For now, we just save the images as-is
    
    save_image_history(db, request.user_id, request.session_id, input_img, output_img, request.scale)
    return {"message": "Image history saved"}

@app.delete("/image/history/remove")
def remove_history(session_id: int, db: Session = Depends(get_db)):
    remove_image_history(db, session_id)
    return {"message": "Image history removed"}

@app.get("/image/history")
def get_history(user_id: Optional[int] = None, session_id: Optional[int] = None, db: Session = Depends(get_db)):
    if user_id is None and session_id is None:
        raise HTTPException(status_code=400, detail="Must provide either user_id or session_id")
    
    history = get_image_history(db, user_id, session_id)
    
    # Convert images to base64 for API response
    formatted_history = {}
    for key, (input_img, output_img, scale, timestamp) in history.items():
        input_base64 = b64encode(cv2.imencode('.png', input_img)[1].tobytes()).decode('utf-8')
        output_base64 = b64encode(cv2.imencode('.png', output_img)[1].tobytes()).decode('utf-8')
        formatted_history[key] = {
            "input_image": input_base64,
            "output_image": output_base64,
            "scale": scale,
            "timestamp": timestamp.isoformat()
        }
    return formatted_history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)