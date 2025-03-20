import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

// Định nghĩa interface cho giá trị trả về của hook
interface SignUpFormProps {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  usernameError: string;
  setUsernameError: Dispatch<SetStateAction<string>>;
  emailError: string;
  setEmailError: Dispatch<SetStateAction<string>>;
  passwordError: string;
  setPasswordError: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useSignUpForm = (
  handleSignUp: (data: SignUpFormData) => Promise<{ success: boolean; errors?: any }>,
  backendErrors: { username?: string; email?: string; password?: string } = {}
): SignUpFormProps => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setUsernameError(backendErrors.username || "");
    setEmailError(backendErrors.email || "");
    setPasswordError(backendErrors.password || "");
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

    await handleSignUp({ username, email, password });
  };

  return {
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
  };
};