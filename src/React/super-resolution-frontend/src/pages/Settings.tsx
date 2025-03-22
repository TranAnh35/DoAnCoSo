/** @jsxImportSource @emotion/react */
import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Settingui from "../components/Settingsui"; // Đúng tên import

const Settings: React.FC = () => {
  const [tab, setTab] = React.useState(0); // Tab mặc định là 0
  const navigate = useNavigate();

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    const routes = ["/process", "/evaluate", "/history"];
    navigate(routes[newTab]); // Điều hướng đến route tương ứng
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Header tab={tab} setTab={handleTabChange} />
      </Box>
      <Box sx={{ flex: 1, marginTop: "64px" }}>
        <Settingui tab={tab} setTab={handleTabChange} />
      </Box>
    </Box>
  );
};

export default Settings;
