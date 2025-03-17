import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header";
import { useSnackbar } from "notistack";
import ImageProcessForm from "../components/ImageProcessForm";
import { useImageProcess } from "../hooks/useImageProcess"; // Import hook
import "../styles/ImageProcess.css";

const ImageProcess: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;
  const sessionId = localStorage.getItem("session_id")
    ? parseInt(localStorage.getItem("session_id")!)
    : undefined;

  // Sử dụng hook useImageProcess
  const {
    inputPreview,
    outputImage,
    lrResized,
    scale,
    setScale,
    handleFileChange,
    handleSubmit,
    handleClear,
  } = useImageProcess(enqueueSnackbar, userId, sessionId);

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 1) navigate("/evaluate");
    else if (newTab === 2) navigate("/history");
  };

  return (
    <Box>
      <Header tab={tab} setTab={handleTabChange} />
      <Toolbar />
      <ImageProcessForm
        userId={userId}
        inputPreview={inputPreview}
        outputImage={outputImage}
        lrResized={lrResized}
        scale={scale}
        setScale={setScale}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
      />
    </Box>
  );
};

export default ImageProcess;