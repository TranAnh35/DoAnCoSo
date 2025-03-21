/** @jsxImportSource @emotion/react */
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
import { useNavigate } from "react-router-dom";
import "../styles/ImageProcess.css";

interface HeaderProps {
  tab: number;
  setTab: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ tab, setTab }) => {
  const { anchorEl, handleMenuOpen, handleMenuClose } = useMenu();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSignOut } = useAuth(enqueueSnackbar);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings");
    setTab(-1); // Đặt tab về -1 khi vào Settings để không chọn tab nào
    handleMenuClose();
  };

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    const routes = ["/process", "/evaluate", "/history"];
    navigate(routes[newTab]); // Điều hướng trực tiếp trong Header
  };

  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar className="header-toolbar">
        <div className="header-left">
          <img src="/logopnk.png" alt="Logo" className="logo-img" />
          <Typography variant="h6" className="header-title">
            Super Resolution
          </Typography>
          <Tabs
            value={tab >= 0 && tab <= 2 ? tab : false} // Chỉ hiển thị tab nếu trong phạm vi 0-2
            onChange={(_, newValue) => handleTabChange(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            className="header-tabs"
          >
            <Tab label="✨ Nâng cấp ảnh" /> {/* Tab 0 */}
            <Tab label="📊 Đánh giá chất lượng" /> {/* Tab 1 */}
            <Tab label="📜 Lịch sử" /> {/* Tab 2 */}
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
            <MenuItem onClick={handleSettingsClick}>Cài đặt</MenuItem>
            <MenuItem
              onClick={() => {
                handleSignOut();
                handleMenuClose();
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
