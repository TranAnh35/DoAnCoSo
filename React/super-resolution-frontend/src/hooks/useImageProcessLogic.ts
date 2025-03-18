// hooks/useImageProcessLogic.ts

import { useState, useEffect } from "react";
import { useImageProcess } from "./useImageProcess";

export const useImageProcessLogic = (
  enqueueSnackbar: (message: string, options?: any) => void,
  userId?: number,
  sessionId?: number
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageInfo, setImageInfo] = useState({
    name: "Ảnh gốc",
    originalSize: "",
    targetSize: "",
  });

  const {
    inputPreview,
    results,
    selectedScale,
    setSelectedScale,
    handleProcess,
    handleSave,
    handleClear,
  } = useImageProcess(enqueueSnackbar, userId, sessionId);

  const handleFileChange = async (file: File, preview: string) => {
    setIsProcessing(true);
    await handleProcess(file, preview);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    const result = results[selectedScale];
    if (!result?.output) return;
    const link = document.createElement("a");
    link.href = result.output;
    link.download = `super_resolution_${selectedScale}x.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAndDownload = async () => {
    await handleSave();
    handleDownload();
  };

  useEffect(() => {
    if (inputPreview) {
      const img = new Image();
      img.src = inputPreview;
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const targetWidth = originalWidth * selectedScale;
        const targetHeight = originalHeight * selectedScale;
        setImageInfo({
          name: "Ảnh gốc",
          originalSize: `${originalWidth}x${originalHeight}`,
          targetSize: `${targetWidth}x${targetHeight}`,
        });
      };
    }
  }, [inputPreview, selectedScale]);

  return {
    isProcessing,
    imageInfo,
    inputPreview,
    results,
    selectedScale,
    setSelectedScale,
    handleFileChange,
    handleSaveAndDownload,
    handleClear,
  };
};