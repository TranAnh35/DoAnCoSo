import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import "../styles/SignIn_SignUp.css"; // Đường dẫn đúng nếu đã di chuyển

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
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
              {title}
            </Typography>
            {children} {/* Form sẽ được render ở đây */}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthLayout;
