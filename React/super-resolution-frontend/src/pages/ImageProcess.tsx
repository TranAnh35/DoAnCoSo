import React from "react";
import { Box, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Header from "../components/Header";
import ImageUploader from "../components/ImageUploader";
import EnhancementInterface from "../components/EnhancementInterface";
import LoadingSpinner from "../components/LoadingSpinner";
import { useImageProcessLogic } from "../hooks/useImageProcessLogic";
import { useHeader } from "../hooks/useHeader";

const ImageProcess: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;
  const sessionId = localStorage.getItem("guest")
    ? parseInt(localStorage.getItem("guest")!)
    : undefined;

  const {
    isProcessing,
    imageInfo,
    inputPreview,
    results,
    selectedScale,
    setSelectedScale,
    handleFileChange,
    handleSaveAndDownload,
    handleClear,
  } = useImageProcessLogic(enqueueSnackbar, userId, sessionId);

  const {
    tab,
    handleTabChange,
  } = useHeader(navigate); // Truyền navigate vào useHeader

  return (
    <Box>
      <Header tab={tab} setTab={handleTabChange} />
      <Toolbar />
      {!inputPreview ? (
        <ImageUploader
          onImageChange={handleFileChange}
          onReset={handleClear}
          preview={inputPreview}
          width="800px"
          height="600px"
        />
      ) : isProcessing ? (
        <LoadingSpinner height="600px" />
      ) : (
        <EnhancementInterface
          inputPreview={inputPreview}
          results={results as Record<2 | 3 | 4, { lrResized: string; output: string }>}
          scale={selectedScale}
          setScale={setSelectedScale}
          handleSave={handleSaveAndDownload}
          handleClear={handleClear}
          imageInfo={imageInfo}
        />
      )}
    </Box>
  );
};

export default ImageProcess;