import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import SignInForm from "../components/SignInForm";
import { useSnackbar } from "notistack";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleSignIn = async (data: { username: string; password: string }) => {
    try {
      const response = await signinUser(data);
      if (response.success) {
        localStorage.setItem("user_id", response.user_id!.toString());
        enqueueSnackbar("Đăng nhập thành công! Hãy tận hưởng chương trình.", { variant: "success", autoHideDuration: 1000 });
        navigate("/process");
      } else {
        setErrors(response.errors);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrors({ username: "Đã xảy ra lỗi, vui lòng thử lại!" });
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("guest", "true");
    navigate("/process");
  };

  return (
    <AuthLayout title="Đăng nhập">
      <SignInForm onSubmit={handleSignIn} onGuestLogin={handleGuestLogin} backendErrors={errors} />
    </AuthLayout>
  );
};

export default SignIn;