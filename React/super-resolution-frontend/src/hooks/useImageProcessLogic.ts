// hooks/useImageProcessLogic.ts

import { useState, useEffect } from "react";
import { useImageProcess } from "./useImageProcess";
import { ImageHistoryRequest } from "../types/api";
import { saveImageHistory } from "../services/api";

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
    handleClear,
  } = useImageProcess(enqueueSnackbar);

  const handleFileChange = async (file: File, preview: string) => {
    setIsProcessing(true);
    await handleProcess(file, preview);
    setIsProcessing(false);
  };

  const handleSave = async () => {
    if (!inputPreview || !results[selectedScale]?.output) {
      enqueueSnackbar("Không có ảnh để lưu lịch sử!", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }

    try {
      const base64Output = results[selectedScale]!.output.split(",")[1];

      if (userId) {
        const historyRequest: ImageHistoryRequest = {
          user_id: userId,
          input_image: inputPreview.split(",")[1],
          output_image: base64Output,
          scale: selectedScale,
        };
        await saveImageHistory(historyRequest);
      }

      if (sessionId) {
        const historyRequest: ImageHistoryRequest = {
          session_id: sessionId,
          input_image: inputPreview.split(",")[1],
          output_image: base64Output,
          scale: selectedScale,
        };
        await saveImageHistory(historyRequest);
      }

      enqueueSnackbar("Đã lưu lịch sử thành công!", {
        variant: "success",
        autoHideDuration: 1500,
      });
    } catch (error: any) {
      console.error("Lỗi khi lưu lịch sử:", error);
      enqueueSnackbar(error.response?.data?.detail || "Có lỗi xảy ra khi lưu lịch sử!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
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