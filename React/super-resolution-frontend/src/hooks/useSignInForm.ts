import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface SignInFormData {
  username: string;
  password: string;
}

// Định nghĩa interface cho giá trị trả về của hook
interface SignInFormProps {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  usernameError: string;
  setUsernameError: Dispatch<SetStateAction<string>>;
  passwordError: string;
  setPasswordError: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleGuestLogin: () => Promise<{ success: boolean }>;
}

export const useSignInForm = (
  handleSignIn: (data: SignInFormData) => Promise<{ success: boolean; errors?: any }>,
  handleGuestLogin: () => Promise<{ success: boolean }>,
  backendErrors: { username?: string; password?: string } = {}
): SignInFormProps => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setUsernameError(backendErrors.username || "");
    setPasswordError(backendErrors.password || "");
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

    await handleSignIn({ username, password });
  };

  return {
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
  };
};