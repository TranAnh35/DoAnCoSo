import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header";
import HistoryForm from "../components/HistoryForm";
import { useImageProcessLogic } from "../hooks/useImageProcessLogic";
import { useSnackbar } from "notistack";
import { useImageHistory } from "../hooks/useImageHistory"; // Import hook
import "../styles/ImageProcess.css";

const History: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(2);
  const { enqueueSnackbar } = useSnackbar();
  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;
  const sessionId = localStorage.getItem("guest")
    ? parseInt(localStorage.getItem("guest")!)
    : undefined;

  const { history, selectedHistory, setSelectedHistory, handleRefreshHistory } =
    useImageHistory(userId, sessionId);
 
  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 0) navigate("/process");
    else if (newTab === 1) navigate("/evaluate");
  };
    
  const { handleDownload } = useImageProcessLogic(
    enqueueSnackbar, 
    userId, 
    sessionId,
    history,
    selectedHistory
  );

  return (
    <Box>
      <Header tab={tab} setTab={handleTabChange} />
      <Toolbar />
      <HistoryForm
        history={history}
        selectedHistory={selectedHistory}
        setSelectedHistory={setSelectedHistory}
        handleRefreshHistory={handleRefreshHistory}
        handleDownload={handleDownload}
      />
    </Box>
  );
};

export default History;