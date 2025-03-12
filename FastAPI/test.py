import cv2
import pytest
import httpx
import numpy as np
from fastapi.testclient import TestClient
from main import app
from database import get_db, SessionLocal, Base, engine
from sqlalchemy.orm import Session
from sqlalchemy import text
from base64 import b64encode

# Tạo fixture để sử dụng TestClient
@pytest.fixture
def client():
    return TestClient(app)

# Tạo fixture để quản lý database session
@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override dependency get_db để dùng trong test
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fixture để xóa và tạo lại database trước khi chạy các test
@pytest.fixture(autouse=True)
def setup_database():
    # Xóa tất cả các bảng
    Base.metadata.drop_all(bind=engine)
    # Tạo lại tất cả các bảng
    Base.metadata.create_all(bind=engine)
    yield  # Chờ các test chạy xong
    # Có thể thêm cleanup nếu cần

app.dependency_overrides[get_db] = override_get_db

# Test endpoint đăng ký người dùng
def test_register_user(client: TestClient, db_session: Session):
    response = client.post(
        "/register",
        json={"username": "testuser", "email": "test@example.com", "password": "123456"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Đăng ký thành công!"
    assert "user_id" in data

    # Kiểm tra trong database
    user = db_session.execute(text("SELECT * FROM users WHERE username = 'testuser'")).fetchone()
    assert user is not None

# Test đăng ký với thông tin không hợp lệ
def test_register_user_invalid(client: TestClient):
    response = client.post(
        "/register",
        json={"username": "testuser", "email": "invalid-email", "password": "123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email không hợp lệ!"

# Test endpoint đăng nhập
def test_signin_user(client: TestClient):
    # Đăng ký trước để có user trong DB
    client.post(
        "/register",
        json={"username": "testuser", "email": "test@example.com", "password": "123456"}
    )
    response = client.post(
        "/signin",
        json={"username": "testuser", "password": "123456"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Đăng nhập thành công!"
    assert "user_id" in data

# Test đăng nhập sai mật khẩu
def test_signin_user_wrong_password(client: TestClient):
    response = client.post(
        "/signin",
        json={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Sai username hoặc mật khẩu!"

# Test lấy thông tin người dùng
def test_get_user_info(client: TestClient):
    # Đăng ký trước để có user
    client.post(
        "/register",
        json={"username": "testuser", "email": "test@example.com", "password": "123456"}
    )
    response = client.get("/user/info?user_id=1&info=username")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"

# Test tạo guest session
def test_create_guest_session(client: TestClient):
    response = client.post("/guest/create")
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "session_token" in data

# Test xóa guest session
def test_drop_guest_session(client: TestClient, db_session: Session):
    # Tạo session trước
    response_create = client.post("/guest/create")
    session_id = response_create.json()["session_id"]

    # Xóa session
    response = client.delete(f"/guest/drop?session_id={session_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Guest session dropped"

    # Kiểm tra trong database
    session = db_session.execute(text("SELECT * FROM guest_sessions WHERE id = :id"), {"id": session_id}).fetchone()
    assert session is None

# Test lưu lịch sử ảnh
def test_save_image_history(client: TestClient, db_session: Session):
    # Đăng ký user trước
    client.post(
        "/register",
        json={"username": "testuser", "email": "test@example.com", "password": "123456"}
    )
    
    # Tạo ảnh test đơn giản
    img = cv2.imread("img/lr_cat.jpg")
    img_bytes = cv2.imencode('.png', img)[1].tobytes()
    img_base64 = b64encode(img_bytes).decode('utf-8')

    response = client.post(
        "/image/history/save",
        json={
            "user_id": 1,
            "session_id": None,
            "input_image": img_base64,
            "output_image": img_base64,
            "scale": 2
        }
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Image history saved"

# Test lấy lịch sử ảnh
def test_get_image_history(client: TestClient):
    # Đăng ký và lưu lịch sử trước
    client.post(
        "/register",
        json={"username": "testuser", "email": "test@example.com", "password": "123456"}
    )
    img = cv2.imread("img/lr_cat.jpg")
    img_bytes = cv2.imencode('.png', img)[1].tobytes()
    img_base64 = b64encode(img_bytes).decode('utf-8')
    client.post(
        "/image/history/save",
        json={
            "user_id": 1,
            "session_id": None,
            "input_image": img_base64,
            "output_image": img_base64,
            "scale": 2
        }
    )
    
    response = client.get("/image/history?user_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert len(data) > 0

# Test xóa lịch sử ảnh
def test_remove_image_history(client: TestClient, db_session: Session):
    # Tạo session và lưu lịch sử trước
    session_response = client.post("/guest/create")
    session_id = session_response.json()["session_id"]
    
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    img_bytes = cv2.imencode('.png', img)[1].tobytes()
    img_base64 = b64encode(img_bytes).decode('utf-8')
    
    client.post(
        "/image/history/save",
        json={
            "user_id": None,
            "session_id": session_id,
            "input_image": img_base64,
            "output_image": img_base64,
            "scale": 2
        }
    )

    # Xóa lịch sử
    response = client.delete(f"/image/history/remove?session_id={session_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Image history removed"

if __name__ == "__main__":
    pytest.main(["-v"])