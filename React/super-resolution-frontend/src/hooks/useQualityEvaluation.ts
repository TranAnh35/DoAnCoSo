import { useState } from "react";
import { evaluateQuality } from "../services/api";
import { QualityEvaluationResponse } from "../types/api";

export const useQualityEvaluation = () => {
  const [srImage, setSrImage] = useState<File | null>(null);
  const [hrImage, setHrImage] = useState<File | null>(null);
  const [srPreview, setSrPreview] = useState<string | null>(null);
  const [hrPreview, setHrPreview] = useState<string | null>(null);
  const [psnr, setPsnr] = useState<number | null>(null);
  const [ssim, setSsim] = useState<number | null>(null);

  const handleSrImageChange = (file: File, preview: string) => {
    setSrImage(file);
    setSrPreview(preview);
  };

  const handleHrImageChange = (file: File, preview: string) => {
    setHrImage(file);
    setHrPreview(preview);
  };

  const handleEvaluate = async () => {
    if (!srImage || !hrImage) {
      alert("Vui lòng chọn cả ảnh SR và ảnh HR để đánh giá!");
      return;
    }
    try {
      const response: QualityEvaluationResponse = await evaluateQuality(srImage, hrImage);
      setPsnr(response.psnr);
      setSsim(response.ssim);
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      alert("Có lỗi xảy ra khi đánh giá chất lượng ảnh!");
    }
  };

  const handleResetSrImage = () => {
    setSrImage(null);
    setSrPreview(null);
  };

  const handleResetHrImage = () => {
    setHrImage(null);
    setHrPreview(null);
  };

  return {
    srPreview,
    hrPreview,
    psnr,
    ssim,
    handleSrImageChange,
    handleHrImageChange,
    handleEvaluate,
    handleResetSrImage,
    handleResetHrImage,
  };
};