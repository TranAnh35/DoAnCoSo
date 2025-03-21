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

const Settingui: React.FC = () => {
  const [tab] = React.useState(0);
  const [openAccountModal, setOpenAccountModal] = React.useState(false);
  const [openPasswordModal, setOpenPasswordModal] = React.useState(false);

  return (
    <>
      <Header tab={tab} setTab={() => {}} />
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
              >
                Change
              </Button>
            </div>
            <div css={sectionContentStyle}>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                Username: Not set
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Email: Not set
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
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="Enter new email"
              required
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
