from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.exc import IntegrityError
import bcrypt
import re
import uuid
import cv2
import numpy as np

# URL kết nối PostgreSQL
URL_DATABASE = 'postgresql://postgres:123456@localhost:3525/super_resolution'

# Tạo engine và session
engine = create_engine(URL_DATABASE)
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

def register_user(db, username, email, password):
    if not username or not email or not password:
        return None, "Vui lòng nhập đầy đủ thông tin!", False

    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not re.match(email_regex, email):
        return None, "Email không hợp lệ!", False

    if len(password) < 6:
        return None, "Mật khẩu phải có ít nhất 6 ký tự!", False

    lower_username = username.lower()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    from schemas import User
    new_user = User(username=lower_username, email=email, password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user.id, "Đăng ký thành công!", True
    except IntegrityError:
        db.rollback()
        return None, "Username hoặc email đã tồn tại!", False
    except Exception as e:
        db.rollback()
        return None, f"Lỗi không xác định: {str(e)}", False

def signin_user(db, username, password):
    if not username or not password:
        return None, "Vui lòng nhập đầy đủ username và mật khẩu!", False

    from schemas import User
    lower_username = username.lower()
    user = db.query(User).filter(User.username == lower_username).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return user.id, "Đăng nhập thành công!", True
    return None, "Sai username hoặc mật khẩu!", False

def get_information(db, user_id=None, info="username"):
    from schemas import User
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            if info == "all":
                return user.__dict__
            return getattr(user, info, None)
    return None

def create_guest_session(db):
    from schemas import GuestSession
    session_token = str(uuid.uuid4())
    new_session = GuestSession(session_token=session_token)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session.id, new_session.session_token, True

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