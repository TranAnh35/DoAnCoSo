import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useMenu } from "../hooks/useMenu";
import { useAuth } from "../hooks/useAuth";
import { useSnackbar } from "notistack";
import "../styles/ImageProcess.css";

interface HeaderProps {
  tab: number;
  setTab: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ tab, setTab }) => {
  const { anchorEl, handleMenuOpen, handleMenuClose } = useMenu();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSignOut } = useAuth(enqueueSnackbar);

  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar className="header-toolbar">
        <div className="header-left">
          <img src="/logopnk.png" alt="Logo" className="logo-img" />
          <Typography variant="h6" className="header-title">
            Super Resolution
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            className="header-tabs"
          >
            <Tab label="✨ Nâng cấp ảnh" />
            <Tab label="📊 Đánh giá chất lượng" />
            <Tab label="📜 Lịch sử" />
          </Tabs>
        </div>
        <div className="header-right">
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            className="header-menu-btn"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Cài đặt</MenuItem>
            <MenuItem onClick={() => { handleSignOut(); handleMenuClose(); }}>
              Đăng xuất
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;