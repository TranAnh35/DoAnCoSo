from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db, register_user, signin_user, get_information, create_guest_session, drop_guest_session, save_image_history, remove_image_history, get_image_history
from models import process_image 
from pydantic import BaseModel
from typing import Optional
import torch
import cv2
import numpy as np
from base64 import b64encode, b64decode
from basicsr.metrics import calculate_psnr, calculate_ssim
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
class ProcessImageRequest(BaseModel):
    scale: int
    user_id: Optional[int] = None
    session_id: Optional[int] = None

@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    user_id, errors, success = register_user(db, user.username, user.email, user.password)
    return {"user_id": user_id if success else None, "errors": errors, "success": success}

@app.post("/signin")
def signin(user: UserSignin, db: Session = Depends(get_db)):
    user_id, errors, success = signin_user(db, user.username, user.password)
    if not success:
        return {"errors": errors, "success": False}
    return {"user_id": user_id, "errors": {}, "success": True}

@app.get("/user/info")
def user_info(user_id: int, info: str = "username", db: Session = Depends(get_db)):
    result = get_information(db, user_id=user_id, info=info)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {info: result}

@app.post("/guest/create")
def create_guest(db: Session = Depends(get_db)):
    session_id, session_token = create_guest_session(db)
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
    
@app.post("/process-image")
async def process_image_endpoint(
    file: UploadFile = File(...),
    scale: int = 2
):

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    result = process_image(image, scale)
    return result

@app.post("/evaluate-quality")
async def evaluate_quality_endpoint(
    sr_image: UploadFile = File(...),
    hr_image: UploadFile = File(...)
):
    sr_contents = await sr_image.read()
    hr_contents = await hr_image.read()
    
    sr_img = cv2.imdecode(np.frombuffer(sr_contents, np.uint8), cv2.IMREAD_COLOR)
    hr_img = cv2.imdecode(np.frombuffer(hr_contents, np.uint8), cv2.IMREAD_COLOR)
    
    if (sr_img.shape != hr_img.shape):
        return {"psnr": None, "ssim": None, "error": "Kích thước hình ảnh không khớp"}

    psnr_value = calculate_psnr(sr_img, hr_img, crop_border=4, test_y_channel=True)
    ssim_value = calculate_ssim(sr_img, hr_img, crop_border=4, test_y_channel=True)
    
    import math
    
    if math.isinf(psnr_value):
        psnr_value = 100.0
    if math.isnan(psnr_value):
        psnr_value = 0.0
    if math.isinf(ssim_value):
        ssim_value = 1.0
    if math.isnan(ssim_value):
        ssim_value = 0.0
    
    return {"psnr": round(float(psnr_value), 4), "ssim": round(float(ssim_value), 4)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    #  uvicorn main:app --host 0.0.0.0 --port 8000 --reload