from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine
from typing import Optional, Dict
import numpy as np
import bcrypt
import uuid
import cv2
import re
import os
from dotenv import load_dotenv
# URL kết nối PostgreSQL
load_dotenv()

# Tạo engine và session
engine = create_engine(os.getenv('URL_DATABASE'))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

"""
Trong các hàm bên dưới có trả về giá trị True, False.
Mục đích để làm dấu hiện để có thể chuyển đổi form 1 cách chính xác
Ví dụ:
Khi đang ở trong Register Form đã nhập đầy đủ thông tin và không có lỗi. Khi này nhấn nút đăng kí sẽ nhận lại giá trị True. Khi này sẽ thực hiện chuyển sang Sign_in Form
Khi có lỗi xảy ra thì khi nhất nút sẽ không chuyển sang Sign_in Form nữa mà giữ nguyên
"""

def check_username(username: str):
    if not username:
        return "Tên người dùng không được để trống"
    if len(username) < 3:
        return "Tên người dùng phải có ít nhất 3 ký tự"
    return None

def check_email(email: str):
    if not email:
        return "Email không được để trống"
    if "@" not in email:
        return "Email phải chứa ký tự '@'"
    local_part, domain_part = email.split("@", 1)
    if not local_part:
        return "Phần trước '@' không được để trống"
    elif not domain_part:
        return "Phần sau '@' không được để trống"
    elif "." not in domain_part:
        return "Phần tên miền phải chứa ít nhất một dấu chấm (.)"
    else:
        domain, tld = domain_part.rsplit(".", 1)
        if not domain:
            return "Tên miền không được để trống"
        elif not tld:
            return "Phần mở rộng tên miền (TLD) không được để trống"
        else:
            email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
            if not re.match(email_regex, email):
                return "Email chứa ký tự không hợp lệ"
    return None

def check_password(password: str):
    if not password:
        return "Mật khẩu không được để trống"
    if len(password) < 8:
        return "Mật khẩu phải có ít nhất 8 ký tự"
    if not re.search(r"[A-Z]", password):
        return "Mật khẩu phải chứa ít nhất một chữ cái in hoa!"
    if not re.search(r"[a-z]", password):
        return "Mật khẩu phải chứa ít nhất một chữ cái thường!"
    if not re.search(r"[0-9]", password):
        return "Mật khẩu phải chứa ít nhất một số!"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!"
    return None

def register_user(db: Session, username: str, email: str, password: str) -> tuple[Optional[int], Dict[str, str], bool]:
    errors: Dict[str, str] = {}

    errors["username"] = check_username(username)
    errors["email"] = check_email(email)
    errors["password"] = check_password(password)

    if errors:
        return None, errors, False

    lower_username = username.lower()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    from schemas import User
    
    if db.query(User).filter(User.username == lower_username).first():
        errors["username"] = "Tên người dùng đã tồn tại!"
    if db.query(User).filter(User.email == email).first():
        errors["email"] = "Email đã tồn tại!"

    if errors:
        return None, errors, False

    from schemas import User

    new_user = User(username=lower_username, email=email, password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user.id, {}, True
    except IntegrityError:
        db.rollback()
        if db.query(User).filter(User.username == lower_username).first():
            errors["username"] = "Tên người dùng đã tồn tại!"
        if db.query(User).filter(User.email == email).first():
            errors["email"] = "Email đã tồn tại!"
        return None, errors, False
    except Exception as e:
        db.rollback()
        errors["username"] = f"Lỗi không xác định: {str(e)}"
        return None, errors, False

def signin_user(db: Session, username: str, password: str) -> tuple[Optional[int], Dict[str, str], bool]:
    errors: Dict[str, str] = {}

    if not username:
        errors["username"] = "Vui lòng nhập tên người dùng!"
    if not password:
        errors["password"] = "Vui lòng nhập mật khẩu!"

    if errors:
        return None, errors, False

    from schemas import User
    
    user = db.query(User).filter(User.username == username.lower()).first()
    if not user:
        errors["username"] = "Tên người dùng không tồn tại!"
        return None, errors, False

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        errors["password"] = "Mật khẩu không đúng!"
        return None, errors, False

    return user.id, {}, True


def get_information(db, user_id=None, info="username"):
    if user_id is None:
        return None
    
    from schemas import User

    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return None
    
    if info == "all":
        return user.__dict__
    
    return getattr(user, info, None)

def change_password(db, user_id, old_password, new_password):
    error = {}
    
    if user_id is None:
        error['user_id'] = "UserID không hợp lệ"
    if old_password is None:
        error['old_password'] = "Mật khẩu cũ không hợp lệ"
    if new_password is None:
        error['new_password'] = "Mật khẩu mới không hợp lệ"
        
    if error:
        return error, False
    
    pass_error = check_password(new_password)
    if pass_error:
        error['new_password'] = pass_error
    
    if error:
        return error, False

    from schemas import User
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise ValueError("User không tồn tại")
    
    if not bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        error['old_password'] = "Mật khẩu cũ không đúng"
        return error, False

    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user.password = hashed_password
    db.commit()
    
    return {}, True

def change_information(db, user_id, new_username, new_email):
    if user_id is None:
        raise ValueError("User ID không hợp lệ")
    
    errors = {}
    
    user_error = check_username(new_username)
    if user_error:
        errors['new_username'] = user_error
    
    email_error = check_email(new_email)
    if email_error:
        errors['new_email'] = email_error
            
    
    if errors:
        return errors, False
    
    from schemas import User
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise ValueError("User not found")
    
    if user.username == new_username.lower() and user.email == new_email:
        return "Don't change anything", False
    
    if db.query(User).filter(User.username == new_username.lower()).first() and new_username.lower() != user.username:
        errors['new_username'] = "Tên người dùng đã tồn tại"
    if db.query(User).filter(User.email == new_email).first() and new_email != user.email:
        errors['new_email'] = "Email đã tồn tại"
    
    if errors:
        return errors, False
    
    if new_username:
        user.username = new_username.lower()
    
    if new_email:
        user.email = new_email
    
    db.commit()
    
    return {}, True

def create_guest_session(db):
    from schemas import GuestSession
    session_token = str(uuid.uuid4())
    new_session = GuestSession(session_token=session_token)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session.id, new_session.session_token

def drop_guest_session(db, session_id):
    from schemas import GuestSession
    db.query(GuestSession).filter(GuestSession.id == session_id).delete()
    db.commit()

def save_image_history(db, user_id, session_id, input_image, output_image, scale):
    if user_id is None and session_id is None:
        raise ValueError("Cả user_id và session_id đều không hợp lệ!")
    
    from schemas import ImageHistory
    input_bytes = cv2.imencode('.png', input_image)[1].tobytes()
    output_bytes = cv2.imencode('.png', output_image)[1].tobytes()
    
    history = ImageHistory(user_id=user_id or None, session_id=session_id or None, 
                           input_image=input_bytes, output_image=output_bytes, scale=scale)
    db.add(history)
    db.commit()

def remove_image_history(db, session_id):
    from schemas import ImageHistory
    db.query(ImageHistory).filter(ImageHistory.session_id == session_id).delete()
    db.commit()

def get_image_history(db, user_id=None, session_id=None):
    from schemas import ImageHistory
    if user_id:
        results = db.query(ImageHistory).filter(ImageHistory.user_id == user_id).order_by(ImageHistory.timestamp.desc()).all()
    else:
        results = db.query(ImageHistory).filter(ImageHistory.session_id == session_id).order_by(ImageHistory.timestamp.desc()).all()
    
    history = []
    for row in results:
        input_img = cv2.imdecode(np.frombuffer(row.input_image, np.uint8), cv2.COLOR_BGR2RGB)
        output_img = cv2.imdecode(np.frombuffer(row.output_image, np.uint8), cv2.COLOR_BGR2RGB)
        history.append((input_img, output_img, row.scale, row.timestamp))
    
    return {
        f"{idx + 1}: {timestamp} | Scale: {scale}x": (input_img, output_img, scale, timestamp)
        for idx, (input_img, output_img, scale, timestamp) in enumerate(history)
    }