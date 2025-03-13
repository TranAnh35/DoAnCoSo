// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { TextField, Button, Container, Typography } from '@mui/material';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser({ username, email, password });
      setMessage(response.message);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Đăng ký thất bại');
    }
  };

  const handleReturnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Ngăn hành vi submit mặc định của form
      navigate('/signin'); // Chuyển hướng sang trang Register
    };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Đăng ký</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">
          Đăng ký
        </Button>
        <Button type="submit" variant="contained" color="secondary" onClick={handleReturnClick}>
          Quay lại
        </Button>
      </form>
      {message && <Typography color={message.includes('thành công') ? 'green' : 'red'}>{message}</Typography>}
    </Container>
  );
};

export default Register;