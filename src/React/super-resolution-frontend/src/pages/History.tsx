import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header";
import HistoryForm from "../components/HistoryForm";
import { useImageHistory } from "../hooks/useImageHistory"; // Import hook
import "../styles/ImageProcess.css";

const History: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(2);
  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;
  const sessionId = localStorage.getItem("guest")
    ? parseInt(localStorage.getItem("guest")!)
    : undefined;

  console.log(sessionId);
  // Sử dụng hook useImageHistory
  const { history, selectedHistory, setSelectedHistory, handleRefreshHistory } =
    useImageHistory(userId, sessionId);

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 0) navigate("/process");
    else if (newTab === 1) navigate("/evaluate");
  };

  // Hàm xử lý nút Quay lại
  const handleBack = () => {
    navigate("/process"); // Quay lại trang process hoặc trang bạn muốn
  };

  return (
    <Box>
      <Header tab={tab} setTab={handleTabChange} />
      <Toolbar />
      <HistoryForm
        history={history}
        selectedHistory={selectedHistory}
        setSelectedHistory={setSelectedHistory}
        handleRefreshHistory={handleRefreshHistory}
        handleBack={handleBack} // Truyền hàm handleBack vào HistoryForm
      />
    </Box>
  );
};

export default History;