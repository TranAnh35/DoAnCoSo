// hooks/useImageProcess.ts
import { useState } from "react";
import { processImage } from "../services/api";
import { ProcessImageResponse } from "../types/api";

export const useImageProcess = (
  enqueueSnackbar: (message: string, options: any) => void
) => {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [results, setResults] = useState<
    Partial<Record<2 | 3 | 4, { lrResized: string; output: string }>>
  >({});
  const [selectedScale, setSelectedScale] = useState<2 | 3 | 4>(2);

  const handleProcess = async (file: File, preview: string) => {
    setInputImage(file);
    setInputPreview(preview);

    try {

      const user_id = localStorage.getItem("user_id");

      const scales: (2 | 3 | 4)[] = [2, 3, 4];
      const newResults: Partial<Record<2 | 3 | 4, { lrResized: string; output: string }>> = {};

      if (user_id) {
        for (const scale of scales) {
          const response: ProcessImageResponse = await processImage(file, scale);
          
          newResults[scale] = {
            lrResized: `data:image/png;base64,${response.lr_resized}`,
            output: `data:image/png;base64,${response.output}`,
          };
        }
      }
      else {
        const response: ProcessImageResponse = await processImage(file, 2);

        newResults[2] = {
          lrResized: `data:image/png;base64,${response.lr_resized}`,
          output: `data:image/png;base64,${response.output}`,
        };
      }

      setResults(newResults);
      enqueueSnackbar("Đã xử lý ảnh hoàn tất!", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error: any) {
      console.error("Lỗi khi xử lý ảnh:", error);
      enqueueSnackbar(error.response?.data?.detail || "Có lỗi xảy ra khi xử lý ảnh!", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleClear = () => {
    setInputImage(null);
    setInputPreview(null);
    setResults({});
  };

  return {
    inputImage,
    inputPreview,
    results,
    selectedScale,
    setSelectedScale,
    handleProcess,
    handleClear,
  };
};