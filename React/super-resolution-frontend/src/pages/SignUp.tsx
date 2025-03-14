import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import SignUpForm from "../components/SignUpForm";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const handleSignUp = async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await registerUser(data);
      console.log(response);
      if (response.success) {
        navigate("/signin");
      } else {
        setErrors(response.errors);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrors({ username: "Đã xảy ra lỗi, vui lòng thử lại!" });
    }
  };

  return (
    <AuthLayout title="Đăng ký">
      <SignUpForm onSubmit={handleSignUp} backendErrors={errors} />
    </AuthLayout>
  );
};

export default SignUp;