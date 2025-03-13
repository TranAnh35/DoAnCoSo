// src/pages/Signin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm import này
import { signinUser } from '../services/api';
import { TextField, Button, Container, Typography } from '@mui/material';

const Signin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signinUser({ username, password });
      setMessage(response.message);
      localStorage.setItem('user_id', response.user_id.toString()); // Lưu user_id
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Đăng nhập thất bại');
    }
  };

  const handleRegisterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Ngăn hành vi submit mặc định của form
    navigate('/register'); // Chuyển hướng sang trang Register
  };

  const handleGuessClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Ngăn hành vi submit mặc định của form
    navigate('/process'); // Chuyển hướng sang trang Register
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Đăng nhập</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
          Đăng nhập
        </Button>
        <Button type="submit" variant="contained" color="secondary" onClick={handleRegisterClick}>
          Đăng ký
        </Button>
        <Button type="submit" variant="contained" color="secondary" onClick={handleGuessClick}>
          Đăng nhập Guess
        </Button>
      </form>
      {message && (
        <Typography color={message.includes('thành công') ? 'green' : 'red'}>{message}</Typography>
      )}
    </Container>
  );
};

export default Signin;