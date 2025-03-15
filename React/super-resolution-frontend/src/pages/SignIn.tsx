import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import SignInForm from "../components/SignInForm";
import { useSignInForm } from "../hooks/useSignInForm";
import { useAuth } from "../hooks/useAuth";
import { useSnackbar } from "notistack";

const SignIn: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const { handleSignIn, handleGuestLogin } = useAuth(enqueueSnackbar);

  const formProps = useSignInForm(
    async (data) => {
      const result = await handleSignIn(data);
      if (!result.success) {
        setErrors(result.errors || {});
      }
      return result;
    },
    handleGuestLogin,
    errors
  );

  return (
    <AuthLayout title="Đăng nhập">
      <SignInForm
        {...formProps}
        setUsernameError={formProps.setUsernameError} // Truyền hàm setUsernameError
        setPasswordError={formProps.setPasswordError} // Truyền hàm setPasswordError
      />
    </AuthLayout>
  );
};

export default SignIn;