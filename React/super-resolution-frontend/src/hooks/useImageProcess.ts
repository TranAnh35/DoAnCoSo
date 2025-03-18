// hooks/useImageProcess.ts
import { useState } from "react";
import { processImage, saveImageHistory } from "../services/api";
import { ProcessImageResponse, ImageHistoryRequest } from "../types/api";

export const useImageProcess = (
  enqueueSnackbar: (message: string, options: any) => void,
  userId?: number,
  sessionId?: number
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
      const scales: (2 | 3 | 4)[] = [2, 3, 4];
      const newResults: Partial<Record<2 | 3 | 4, { lrResized: string; output: string }>> = {};

      for (const scale of scales) {
        const response: ProcessImageResponse = await processImage(file, scale);
        
        newResults[scale] = {
          lrResized: `data:image/png;base64,${response.lr_resized}`,
          output: `data:image/png;base64,${response.output}`,
        };
        // console.log(newResults[scale]!.output);
      }

      setResults(newResults);
      enqueueSnackbar("Đã xử lý ảnh với tất cả các mức scale!", {
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
        enqueueSnackbar("Đã lưu lịch sử cho user!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      }

      if (sessionId) {
        const historyRequest: ImageHistoryRequest = {
          session_id: sessionId,
          input_image: inputPreview.split(",")[1],
          output_image: base64Output,
          scale: selectedScale,
        };
        await saveImageHistory(historyRequest);
        enqueueSnackbar("Đã lưu lịch sử cho session!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi lưu lịch sử:", error);
      enqueueSnackbar(error.response?.data?.detail || "Có lỗi xảy ra khi lưu lịch sử!", {
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
    handleSave,
    handleClear,
  };
};