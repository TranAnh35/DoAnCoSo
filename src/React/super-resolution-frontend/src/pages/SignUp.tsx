import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import SignUpForm from "../components/SignUpForm";
import { useSignUpForm } from "../hooks/useSignUpForm";
import { useAuth } from "../hooks/useAuth";
import { useSnackbar } from "notistack";

const SignUp: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const { handleSignUp } = useAuth(enqueueSnackbar);

  const formProps = useSignUpForm(
    async (data) => {
      const result = await handleSignUp(data);
      if (!result.success) {
        setErrors(result.errors || {});
      }
      return result;
    },
    errors
  );

  return (
    <AuthLayout title="Đăng ký">
      <SignUpForm
        {...formProps}
        setUsernameError={formProps.setUsernameError}
        setEmailError={formProps.setEmailError}
        setPasswordError={formProps.setPasswordError}
      />
    </AuthLayout>
  );
};

export default SignUp;