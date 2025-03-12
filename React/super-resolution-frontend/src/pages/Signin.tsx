// src/pages/Signin.tsx
import React, { useState } from 'react';
import { signinUser } from '../services/api';
import { TextField, Button, Container, Typography } from '@mui/material';

const Signin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
        <Button type="submit" variant="contained" color="primary">
          Đăng nhập
        </Button>
      </form>
      {message && <Typography color={message.includes('thành công') ? 'green' : 'red'}>{message}</Typography>}
    </Container>
  );
};

export default Signin;