/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Header from "./Header";
import {
  mainContainerStyle,
  contentStyle,
  sectionStyle,
  sectionTitleStyle,
  sectionContentStyle,
  changeButtonStyle,
} from "../styles/setting";
import { getInformation } from "../services/api";

const logUserId = () => {
  const userId = localStorage.getItem("user_id");
  console.log(
    userId ? `User ID: ${parseInt(userId)}` : "No User ID in localStorage"
  );
};

const Settingui: React.FC<{ tab: number; setTab: (tab: number) => void }> = ({
  tab,
  setTab,
}) => {
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

  const [userId, setUserId] = useState<number | undefined>(() =>
    localStorage.getItem("user_id")
      ? parseInt(localStorage.getItem("user_id")!)
      : undefined
  );
  const [sessionId, setSessionId] = useState<number | undefined>(() =>
    localStorage.getItem("guest")
      ? parseInt(localStorage.getItem("guest")!)
      : undefined
  );

  useEffect(() => {
    const syncUserInfo = () => {
      const storedUserId = localStorage.getItem("user_id")
        ? parseInt(localStorage.getItem("user_id")!)
        : undefined;
      const storedSessionId = localStorage.getItem("guest")
        ? parseInt(localStorage.getItem("guest")!)
        : undefined;
      setUserId(storedUserId);
      setSessionId(storedSessionId);
      logUserId();
    };

    window.addEventListener("storage", syncUserInfo);
    syncUserInfo();

    return () => window.removeEventListener("storage", syncUserInfo);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId && !sessionId) {
        enqueueSnackbar("Please sign in to view account information", {
          variant: "warning",
        });
        setUsername("Not set");
        setEmail("Not set");
        setNewUsername("");
        setNewEmail("");
        return;
      }

      try {
        if (userId) {
          const [usernameData, emailData] = await Promise.all([
            getInformation(userId, "username"),
            getInformation(userId, "email"),
          ]);
          const fetchedUsername =
            typeof usernameData === "string"
              ? usernameData
              : usernameData?.username || "Not set";
          const fetchedEmail =
            typeof emailData === "string"
              ? emailData
              : emailData?.email || "Not set";
          setUsername(fetchedUsername);
          setEmail(fetchedEmail);
          setNewUsername(fetchedUsername === "Not set" ? "" : fetchedUsername);
          setNewEmail(fetchedEmail === "Not set" ? "" : fetchedEmail);
        } else {
          setUsername("Guest");
          setEmail("Not available for guest");
          setNewUsername("");
          setNewEmail("");
        }
      } catch (error: any) {
        console.error("Failed to fetch user info:", error);
        enqueueSnackbar(error.message || "Failed to load user information", {
          variant: "error",
        });
      }
    };

    fetchUserInfo();
  }, [userId, sessionId, enqueueSnackbar]);
  return (
    <>
      <Header tab={tab} setTab={setTab} />
      <div css={mainContainerStyle}>
        <div css={contentStyle}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            My Account
          </Typography>

          <div css={sectionStyle}>
            <div css={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Account Information
              </Typography>
              <Button
                css={changeButtonStyle}
                onClick={() => setOpenAccountModal(true)}
                disabled={!userId}
              >
                Change
              </Button>
            </div>
            <div css={sectionContentStyle}>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                Username: {username}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Email: {email}
              </Typography>
            </div>
          </div>

          <div css={sectionStyle}>
            <div css={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Password
              </Typography>
              <Button
                css={changeButtonStyle}
                onClick={() => setOpenPasswordModal(true)}
                disabled={!userId}
              >
                Change
              </Button>
            </div>
            <div css={sectionContentStyle}>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Update your password to secure your account.
              </Typography>
            </div>
          </div>
        </div>

        <Dialog
          open={openAccountModal}
          onClose={() => setOpenAccountModal(false)}
        >
          <DialogTitle>Edit Account Information</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              name="username"
              fullWidth
              variant="outlined"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
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
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAccountModal(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openPasswordModal}
          onClose={() => setOpenPasswordModal(false)}
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Old Password"
              name="oldPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Enter your current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="Re-type the new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Settingui;
