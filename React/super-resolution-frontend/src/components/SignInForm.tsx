import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import "../styles/SignIn_SignUp.css";

interface SignInFormProps {
  onSubmit: (data: { username: string; password: string }) => Promise<void>;
  onGuestLogin: () => void;
  backendErrors?: { username?: string; password?: string }; // Lỗi từ backend
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, onGuestLogin, backendErrors = {} }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (backendErrors) {
      setUsernameError(backendErrors.username || "");
      setPasswordError(backendErrors.password || "");
    }
  }, [backendErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const localErrors = {
      username: !username ? "Vui lòng nhập tên người dùng!" : "",
      password: !password ? "Vui lòng nhập mật khẩu!" : "",
    };

    setUsernameError(localErrors.username || backendErrors.username || "");
    setPasswordError(localErrors.password || backendErrors.password || "");

    if (localErrors.username || localErrors.password) {
      return;
    }

    await onSubmit({ username, password });
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
          Đăng nhập
        </Button>
        <Button
          variant="outlined"
          className="login-button"
          style={{ marginTop: "10px" }}
          onClick={onGuestLogin}
        >
          Đăng nhập Guest
        </Button>
      </form>
      <Typography className="signup-text">
        Bạn chưa có tài khoản? <Link href="/register">Đăng ký</Link>
      </Typography>
    </>
  );
};

export default SignInForm;