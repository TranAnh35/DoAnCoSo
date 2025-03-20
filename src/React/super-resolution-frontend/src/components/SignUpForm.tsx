import React from "react";
import { TextField, Button, Typography, Link } from "@mui/material";
import "../styles/SignIn_SignUp.css";

// Sử dụng interface đã định nghĩa trong useSignUpForm
interface SignUpFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  usernameError: string;
  setUsernameError: (value: string) => void;
  emailError: string;
  setEmailError: (value: string) => void;
  passwordError: string;
  setPasswordError: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  usernameError,
  setUsernameError,
  emailError,
  setEmailError,
  passwordError,
  setPasswordError,
  handleSubmit,
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
            if (usernameError) setUsernameError("");
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
            if (emailError) setEmailError("");
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
            if (passwordError) setPasswordError("");
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