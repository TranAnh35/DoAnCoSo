import React, { useState } from "react";
import { registerUser } from "../services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import "./SignIn_SignUp.css";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser({ username, email, password });
      setMessage(response.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage("Đăng ký thất bại: " + error.message);
      } else {
        setMessage("Đăng ký thất bại");
      }
    }
  };

  return (
    <Container maxWidth="xl" className="login-container">
      <Grid container className="login-content">
        <Grid item xs={12} md={6} className="login-left">
          <video className="login-video" autoPlay loop muted>
            <source src="/a.mp4" type="video/mp4" />
          </video>
        </Grid>

        <Grid item xs={12} md={6} className="login-right">
          <div className="login-box">
            <img src="/logopnk.png" alt="logo" className="logo" />
            <Typography variant="h4" className="login-title">
              Register
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                className="login-input"
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                className="login-input"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                className="login-input"
              />
              <Button
                type="submit"
                variant="contained"
                className="login-button"
              >
                Đăng ký
              </Button>
            </form>
            {message && (
              <Typography
                className={`login-message ${
                  message.includes("successful") ? "success" : "error"
                }`}
              >
                {message}
              </Typography>
            )}
            <Typography className="signup-text">
              Bạn đã có tài khoản? <Link href="/signin">Đăng nhập</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
