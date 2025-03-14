import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { signinUser } from "../services/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import "./SignIn_SignUp.css";

const Signin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signinUser({ username, password });
      setMessage(response.message);
      localStorage.setItem("user_id", response.user_id.toString());
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage("Đăng nhập thất bại: " + error.message);
      } else {
        setMessage("Đăng nhập thất bại");
      }
    }
  };

  return (
    <Container maxWidth="xl" className="login-container">
      <Grid container className="login-content">
        {/* Left Side - Video */}
        <Grid item xs={12} md={6} className="login-left">
          <video className="login-video" autoPlay loop muted>
            <source src="/a.mp4" type="video/mp4" />
          </video>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6} className="login-right">
          <div className="login-box">
            <img src="/logopnk.png" alt="logo" className="logo" />
            <Typography variant="h4" className="login-title">
              Đăng nhập
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
                Đăng nhập
              </Button>
            </form>

            <Button
              variant="outlined"
              className="login-button"
              style={{ marginTop: "10px" }}
              onClick={() => {
                localStorage.setItem("guest", "true");
                navigate("/process"); // Chuyển hướng bằng useNavigate
              }}
            >
              Đăng nhập Guest
            </Button>
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
              Don’t have an account? <Link href="/register">Sign up</Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Signin;
