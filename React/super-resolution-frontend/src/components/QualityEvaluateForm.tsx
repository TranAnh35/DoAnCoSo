import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import ImageUploader from "./ImageUploader";
import "../styles/ImageProcess.css";

interface QualityEvaluateFormProps {
  srPreview: string | null;
  hrPreview: string | null;
  psnr: number | null;
  ssim: number | null;
  handleSrImageChange: (file: File, preview: string) => void;
  handleHrImageChange: (file: File, preview: string) => void;
  handleEvaluate: () => void;
  handleResetSrImage: () => void;
  handleResetHrImage: () => void;
}

const QualityEvaluateForm: React.FC<QualityEvaluateFormProps> = ({
  srPreview,
  hrPreview,
  psnr,
  ssim,
  handleSrImageChange,
  handleHrImageChange,
  handleEvaluate,
  handleResetSrImage,
  handleResetHrImage,
}) => {
  return (
    <Container className="tab1-container">
      <Typography variant="h5" gutterBottom>
        Đánh giá chất lượng ảnh
      </Typography>
      <Box className="quality-upload-container">
        <ImageUploader
          label="Ảnh SR"
          id="srImage"
          onImageChange={handleSrImageChange}
          onReset={handleResetSrImage}
          preview={srPreview}
        />
        <ImageUploader
          label="Ảnh HR"
          id="hrImage"
          onImageChange={handleHrImageChange}
          onReset={handleResetHrImage}
          preview={hrPreview}
        />
      </Box>
      <Box className="metrics-container">
        <Box className="metric-box">
          <Typography variant="subtitle2">PSNR</Typography>
          <Typography variant="body1">{psnr !== null ? psnr : "-"}</Typography>
        </Box>
        <Box className="metric-box">
          <Typography variant="subtitle2">SSIM</Typography>
          <Typography variant="body1">{ssim !== null ? ssim : "-"}</Typography>
        </Box>
      </Box>
      <Box className="calculate-container">
        <Button variant="contained" onClick={handleEvaluate} className="calculate-button">
          Tính toán
        </Button>
      </Box>
    </Container>
  );
};

export default QualityEvaluateForm;