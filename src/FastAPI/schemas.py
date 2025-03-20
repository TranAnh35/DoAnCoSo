from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary, DateTime
from database import Base
from datetime import datetime
import pytz

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class GuestSession(Base):
    __tablename__ = "guest_sessions"
    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Bangkok')))

class ImageHistory(Base):
    __tablename__ = "image_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("guest_sessions.id"), nullable=True)
    input_image = Column(LargeBinary, nullable=False)
    output_image = Column(LargeBinary, nullable=False)
    scale = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Bangkok')))