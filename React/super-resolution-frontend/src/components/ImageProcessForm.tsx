import React, { useState, useEffect } from "react";
import { Box, Container, Button, Typography } from "@mui/material";
import EnhancementInterface from "./EnhancementInterface";
import ImageUploader from "./ImageUploader";
import { useImageZoom } from "../hooks/useImageZoom"; // Giữ lại useImageZoom trong component này
import "../styles/ImageProcess.css";

interface ImageProcessFormProps {
  inputPreview: string | null;
  outputImage: string | null;
  lrResized: string | null;
  scale: 2 | 3 | 4;
  setScale: React.Dispatch<React.SetStateAction<2 | 3 | 4>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleClear: () => void;
}

const ImageProcessForm: React.FC<ImageProcessFormProps> = ({
  inputPreview,
  outputImage,
  lrResized,
  scale,
  setScale,
  handleFileChange,
  handleSubmit,
  handleClear,
}) => {
  const { zoomLevel, position, containerRef, handleMouseDown, handleMouseMove, handleMouseUp } =
    useImageZoom(outputImage);

    const [imageInfo, setImageInfo] = useState<{
      name: string;
      originalSize: string;
      targetSize: string;
    }>({
      name: "",
      originalSize: "",
      targetSize: "",
    });
  
    useEffect(() => {
      if (inputPreview) {
        const img = new Image();
        img.src = inputPreview;
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;
          setImageInfo({ name: "Ảnh gốc", originalSize: `${originalWidth}x${originalHeight}`, targetSize: `${originalWidth * scale}x${originalHeight * scale}` });
        };
      }
    }, [inputPreview, scale]);

  const handleDownload = () => {
    if (!outputImage) return;
    const link = document.createElement("a");
    link.href = outputImage;
    link.download = `super_resolution_${scale}x.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {!inputPreview ? (
        <ImageUploader
          onImageChange={(file, preview) => handleFileChange({ target: { files: [file] } } as any)}
          onReset={handleClear}
          preview={inputPreview}
        />
      ) : (
        <EnhancementInterface
          inputPreview={inputPreview}
          scale={scale}
          setScale={setScale}
          imageInfo={imageInfo}
          handleSubmit={handleSubmit}
          handleClear={handleClear}
        />
      )}
      {lrResized && (
        <Container className="lr-container">
          <Typography variant="h5" gutterBottom>
            Ảnh LR Resized
          </Typography>
          <img src={lrResized} alt="LR Resized" className="lr-image" />
        </Container>
      )}
      {outputImage && (
        <Container className="output-container">
          <Typography variant="h5" gutterBottom>
            Ảnh đã nâng cấp
          </Typography>
          <Box
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              overflow: "hidden",
              width: "768px",
              height: "768px",
              border: "1px solid #ccc",
              position: "relative",
            }}
          >
            <img
              src={outputImage}
              alt="Output"
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.3s ease",
                userSelect: "none",
              }}
            />
          </Box>
          <Button variant="contained" onClick={handleDownload} style={{ marginTop: "10px" }}>
            Tải xuống
          </Button>
        </Container>
      )}
    </Box>
  );
};

export default ImageProcessForm;