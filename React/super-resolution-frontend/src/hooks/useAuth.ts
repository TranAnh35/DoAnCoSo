import { useNavigate } from "react-router-dom";
import { registerUser, signinUser, createGuestSession, dropGuestSession } from "../services/api"

export const useAuth = (enqueueSnackbar: (message: string, options: any) => void) => {
  const navigate = useNavigate();

  const handleSignUp = async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await registerUser(data);
      if (response.success) {
        enqueueSnackbar("Đăng ký thành công! Hãy đăng nhập.", {
          variant: "success",
          autoHideDuration: 1500,
        });
        navigate("/signin");
        return { success: true };
      } else {
        return { success: false, errors: response.errors };
      }
    } catch (error: any) {
      console.error("Error:", error);
      enqueueSnackbar("Đã xảy ra lỗi, vui lòng thử lại!", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return { success: false, errors: { global: "Đã xảy ra lỗi, vui lòng thử lại!" } };
    }
  };

  const handleSignIn = async (data: { username: string; password: string }) => {
    try {
      const response = await signinUser(data);
      if (response.success && response.user_id) {
        localStorage.setItem("user_id", response.user_id.toString());
        enqueueSnackbar("Đăng nhập thành công! Hãy tận hưởng chương trình.", {
          variant: "success",
          autoHideDuration: 1500,
        });
        navigate("/process");
        return { success: true };
      } else {
        return { success: false, errors: response.errors };
      }
    } catch (error: any) {
      console.error("Error:", error);
      enqueueSnackbar("Đã xảy ra lỗi, vui lòng thử lại!", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return { success: false, errors: { global: "Đã xảy ra lỗi, vui lòng thử lại!" } };
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await createGuestSession();
      localStorage.setItem("guest", response.session_id.toString());
      enqueueSnackbar("Đăng nhập thành công với vai trò khách!", {
        variant: "success",
        autoHideDuration: 1500,
      });
      navigate("/process");
      return { success: true };
    } catch (error: any) {
      console.error("Error:", error);
      enqueueSnackbar("Đã xảy ra lỗi, vui lòng thử lại!", {
        variant: "error",
        autoHideDuration: 2000,
      });
      return { success: false };
    }
  };

  const handleSignOut = () => {
    const session_id = localStorage.getItem("guest");
    const user_id = localStorage.getItem("user_id");

    if (session_id) {
        localStorage.removeItem("guest");
        dropGuestSession(parseInt(session_id));
    }else if(user_id){
        localStorage.removeItem("user_id");
    }

    localStorage.clear();
    
    enqueueSnackbar("Đăng xuất thành công!", {
      variant: "success",
      autoHideDuration: 1500,
    });

    navigate("/signin");
  };

  return {
    handleSignUp,
    handleSignIn,
    handleGuestLogin,
    handleSignOut,
  };
};
