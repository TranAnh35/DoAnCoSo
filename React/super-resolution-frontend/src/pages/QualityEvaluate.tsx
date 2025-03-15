import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Header from "../components/Header";
import QualityEvaluateForm from "../components/QualityEvaluateForm";
import { useQualityEvaluation } from "../hooks/useQualityEvaluation"; // Import hook
import "../styles/ImageProcess.css";

const QualityEvaluate: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);

  // Sử dụng hook useQualityEvaluation
  const {
    srPreview,
    hrPreview,
    psnr,
    ssim,
    handleSrImageChange,
    handleHrImageChange,
    handleEvaluate,
    handleResetSrImage,
    handleResetHrImage,
  } = useQualityEvaluation();

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 0) navigate("/process");
    else if (newTab === 2) navigate("/history");
  };

  return (
    <Box>
      <Header tab={tab} setTab={handleTabChange} />
      <Toolbar />
      <QualityEvaluateForm
        srPreview={srPreview}
        hrPreview={hrPreview}
        psnr={psnr}
        ssim={ssim}
        handleSrImageChange={handleSrImageChange}
        handleHrImageChange={handleHrImageChange}
        handleEvaluate={handleEvaluate}
        handleResetSrImage={handleResetSrImage}
        handleResetHrImage={handleResetHrImage}
      />
    </Box>
  );
};

export default QualityEvaluate;