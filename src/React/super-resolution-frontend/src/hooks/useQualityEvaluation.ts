import { useState } from "react";
import { evaluateQuality } from "../services/api";
import { QualityEvaluationResponse } from "../types/api";

export const useQualityEvaluation = (enqueueSnackbar: (message: string, options: any) => void) => {
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
      enqueueSnackbar("Vui lòng chọn cả ảnh SR và ảnh HR để đánh giá!", {
        variant: "warning",
        autoHideDuration: 2000,
      });
      return;
    }
    try {
      const response: QualityEvaluationResponse = await evaluateQuality(srImage, hrImage);
      if (response.error) {
        enqueueSnackbar(response.error, {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }
      setPsnr(response.psnr);
      setSsim(response.ssim);
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      enqueueSnackbar("Có lỗi xảy ra khi đánh giá chất lượng ảnh!", {
        variant: "error",
        autoHideDuration: 2000,
      });
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