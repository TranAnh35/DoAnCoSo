import React from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import "../styles/SignIn_SignUp.css";

interface SignInFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  usernameError: string;
  setUsernameError: (value: string) => void; // Thêm prop để xóa lỗi
  passwordError: string;
  setPasswordError: (value: string) => void; // Thêm prop để xóa lỗi
  handleSubmit: (e: React.FormEvent) => void;
  handleGuestLogin: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  usernameError,
  setUsernameError,
  passwordError,
  setPasswordError,
  handleSubmit,
  handleGuestLogin,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Tên người dùng"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError(""); // Xóa lỗi khi nhập
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
            if (passwordError) setPasswordError(""); // Xóa lỗi khi nhập
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
          onClick={handleGuestLogin}
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