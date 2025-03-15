import { useState } from "react";
import { processImage, saveImageHistory } from "../services/api";
import { ProcessImageResponse, ImageHistoryRequest } from "../types/api";

export const useImageProcess = (userId?: number) => {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [lrResized, setLrResized] = useState<string | null>(null);
  const [scale, setScale] = useState(2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setInputPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!inputImage) {
      alert("Vui lòng chọn một ảnh để xử lý!");
      return;
    }
    try {
      const response: ProcessImageResponse = await processImage(inputImage, scale);
      setLrResized(`data:image/png;base64,${response.lr_resized}`);
      setOutputImage(`data:image/png;base64,${response.output}`);

      if (userId && inputPreview) {
        const historyRequest: ImageHistoryRequest = {
          user_id: userId,
          input_image: inputPreview.split(",")[1],
          output_image: response.output,
          scale,
        };
        await saveImageHistory(historyRequest);
      }
    } catch (error: any) {
      console.error("Lỗi khi xử lý ảnh:", error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra khi xử lý ảnh!");
    }
  };

  const handleClear = () => {
    setInputImage(null);
    setInputPreview(null);
    setOutputImage(null);
    setLrResized(null);
  };

  return {
    inputImage,
    inputPreview,
    outputImage,
    lrResized,
    scale,
    setScale,
    handleFileChange,
    handleSubmit,
    handleClear,
  };
};