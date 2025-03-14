import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import "../styles/SignIn_SignUp.css";

interface SignUpFormProps {
  onSubmit: (data: { username: string; email: string; password: string }) => Promise<void>;
  backendErrors?: { username?: string; email?: string; password?: string }; // Lỗi từ backend
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, backendErrors = {} }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (backendErrors) {
      setUsernameError(backendErrors.username || "");
      setEmailError(backendErrors.email || "");
      setPasswordError(backendErrors.password || "");
    }
  }, [backendErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localErrors = {
      username: !username ? "Vui lòng nhập tên người dùng!" : "",
      email: !email ? "Vui lòng nhập email!" : "",
      password: !password ? "Vui lòng nhập mật khẩu!" : "",
    };

    setUsernameError(localErrors.username);
    setEmailError(localErrors.email);
    setPasswordError(localErrors.password);

    if (localErrors.username || localErrors.email || localErrors.password) {
      return;
    }

    await onSubmit({ username, email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Tên người dùng"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError("");
          }}
          fullWidth
          margin="normal"
          className="login-input"
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          fullWidth
          margin="normal"
          className="login-input"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          fullWidth
          margin="normal"
          className="login-input"
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button type="submit" variant="contained" className="login-button">
          Đăng ký
        </Button>
      </form>
      <Typography className="signup-text">
        Bạn đã có tài khoản? <Link href="/signin">Đăng nhập</Link>
      </Typography>
    </>
  );
};

export default SignUpForm;
