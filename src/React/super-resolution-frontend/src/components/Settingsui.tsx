/** @jsxImportSource @emotion/react */
import React from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Header from "./Header";
import {
  mainContainerStyle,
  contentStyle,
  sectionStyle,
  sectionTitleStyle,
  sectionContentStyle,
  changeButtonStyle,
} from "../styles/setting";
import { useSetting } from "../hooks/useSetting"; // Import hook

const Settingui: React.FC<{ tab: number; setTab: (tab: number) => void }> = ({ tab, setTab }) => {
  const {
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
  } = useSetting({ tab, setTab });

  return (
    <>
      <Header tab={tab} setTab={setTab} />
      <div css={mainContainerStyle}>
        <div css={contentStyle}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Tài khoản của tôi
          </Typography>

          <div css={sectionStyle}>
            <div css={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Thông tin tài khoản
              </Typography>
              <Button
                css={changeButtonStyle}
                onClick={() => setOpenAccountModal(true)}
                disabled={!userId}
              >
                Thay đổi
              </Button>
            </div>
            <div css={sectionContentStyle}>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                Tên người dùng: {username}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Email: {email}
              </Typography>
            </div>
          </div>

          <div css={sectionStyle}>
            <div css={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Mật khẩu
              </Typography>
              <Button
                css={changeButtonStyle}
                onClick={() => setOpenPasswordModal(true)}
                disabled={!userId}
              >
                Thay đổi
              </Button>
            </div>
            <div css={sectionContentStyle}>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
              </Typography>
            </div>
          </div>
        </div>

        <Dialog open={openAccountModal} onClose={() => setOpenAccountModal(false)}>
          <DialogTitle>Chỉnh sửa thông tin tài khoản</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên người dùng"
              name="username"
              fullWidth
              variant="outlined"
              placeholder="Nhập tên người dùng mới"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                if (usernameError) setUsernameError("");
              }}
              error={!!usernameError}
              helperText={usernameError}
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="Nhập email mới"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              error={!!emailError}
              helperText={emailError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAccountModal(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleAccountUpdate}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Mật khẩu cũ"
              name="oldPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (oldPasswordError) setOldPasswordError("");
              }}
              error={!!oldPasswordError}
              helperText={oldPasswordError}
              required
            />
            <TextField
              margin="dense"
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (newPasswordError) setNewPasswordError("");
              }}
              error={!!newPasswordError}
              helperText={newPasswordError}
              required
            />
            <TextField
              margin="dense"
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError("");
              }}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordModal(false)}>Hủy</Button>
            <Button variant="contained" onClick={handlePasswordChange}>Lưu</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Settingui;