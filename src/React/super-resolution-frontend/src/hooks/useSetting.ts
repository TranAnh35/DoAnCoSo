import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSnackbar } from "notistack";
import { getInformation, changeInformation, changePassword } from "../services/api";

interface SettingProps {
  tab: number;
  setTab: (tab: number) => void;
}

interface SettingHookReturn {
  openAccountModal: boolean;
  setOpenAccountModal: Dispatch<SetStateAction<boolean>>;
  openPasswordModal: boolean;
  setOpenPasswordModal: Dispatch<SetStateAction<boolean>>;
  username: string;
  email: string;
  newUsername: string;
  setNewUsername: Dispatch<SetStateAction<string>>;
  newEmail: string;
  setNewEmail: Dispatch<SetStateAction<string>>;
  usernameError: string;
  setUsernameError: Dispatch<SetStateAction<string>>;
  emailError: string;
  setEmailError: Dispatch<SetStateAction<string>>;
  oldPassword: string;
  setOldPassword: Dispatch<SetStateAction<string>>;
  newPassword: string;
  setNewPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  oldPasswordError: string;
  setOldPasswordError: Dispatch<SetStateAction<string>>;
  newPasswordError: string;
  setNewPasswordError: Dispatch<SetStateAction<string>>;
  confirmPasswordError: string;
  setConfirmPasswordError: Dispatch<SetStateAction<string>>;
  userId: number | undefined;
  handleAccountUpdate: () => Promise<void>;
  handlePasswordChange: () => Promise<void>;
}

export const useSetting = ({ tab, setTab }: SettingProps): SettingHookReturn => {
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState<string>("Not set");
  const [email, setEmail] = useState<string>("Not set");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPasswordError, setOldPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId) {
        try {
          const usernameResponse = await getInformation(userId, "username");
          const emailResponse = await getInformation(userId, "email");
          setUsername(usernameResponse.username || "Not set");
          setEmail(emailResponse.email || "Not set");
        } catch (error) {
          enqueueSnackbar("Failed to fetch user information", { variant: "error" });
        }
      }
    };
    fetchUserInfo();
  }, [userId, enqueueSnackbar]);

  const handleOpenAccountModal = () => {
    setNewUsername(username === "Not set" ? "" : username); // Điền sẵn username hiện tại
    setNewEmail(email === "Not set" ? "" : email); // Điền sẵn email hiện tại
    setUsernameError(""); // Reset lỗi
    setEmailError(""); // Reset lỗi
    setOpenAccountModal(true);
  };

  const handleAccountUpdate = async () => {
    setUsernameError("");
    setEmailError("");

    const localErrors = {
      username: !newUsername.trim() ? "Vui lòng nhập tên người dùng!" : "",
      email: !newEmail.trim()
        ? "Vui lòng nhập email!"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
        ? "Định dạng email không hợp lệ!"
        : "",
    };

    setUsernameError(localErrors.username);
    setEmailError(localErrors.email);

    if (localErrors.username || localErrors.email || !userId) return;

    const response = await changeInformation(userId, newUsername, newEmail);
    console.log(response.message);
    if (response.message === "Information changed successfully") {
        setUsername(newUsername);
        setEmail(newEmail);
        setOpenAccountModal(false);
        setNewUsername("");
        setNewEmail("");
        enqueueSnackbar("Cập nhật thông tin tài khoản thành công", {
          variant: "success",
          autoHideDuration: 2000,
        });
    } else if (response.message === "Don't change anything") {
        enqueueSnackbar("Thông tin không có sự thay đổi", {
            variant: "warning",
            autoHideDuration: 2000,
          });
    } else {
        const backendErrors = typeof response.message === "object" ? response.message : {};
        setUsernameError(backendErrors.old_password || "");
        setEmailError(backendErrors.new_password || "");
    }
  };

  const handlePasswordChange = async () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    const localErrors = {
      oldPassword: !oldPassword ? "Vui lòng nhập mật khẩu cũ!" : "",
      newPassword: !newPassword ? "Vui lòng nhập mật khẩu mới!" : "",
      confirmPassword: !confirmPassword ? "Vui lòng xác nhận mật khẩu!" : "",
    };

    setOldPasswordError(localErrors.oldPassword);
    setNewPasswordError(localErrors.newPassword);
    setConfirmPasswordError(localErrors.confirmPassword);

    if (localErrors.oldPassword || localErrors.newPassword || localErrors.confirmPassword || !userId) return;

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const response = await changePassword(userId, oldPassword, newPassword);
    if (response.message === "Password changed successfully") {
        setOpenPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        enqueueSnackbar("Đổi mật khẩu thành công", {
        variant: "success",
        autoHideDuration: 2000,
        });
    } else {
        const backendErrors = typeof response.message === "object" ? response.message : {};
        setOldPasswordError(backendErrors.old_password || "");
        setNewPasswordError(backendErrors.new_password || "");
    }
  };

  return {
    openAccountModal,
    setOpenAccountModal,
    openPasswordModal,
    setOpenPasswordModal,
    username,
    email,
    newUsername,
    setNewUsername,
    newEmail,
    setNewEmail,
    usernameError,
    setUsernameError,
    emailError,
    setEmailError,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    oldPasswordError,
    setOldPasswordError,
    newPasswordError,
    setNewPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    userId,
    handleAccountUpdate,
    handlePasswordChange,
  };
};