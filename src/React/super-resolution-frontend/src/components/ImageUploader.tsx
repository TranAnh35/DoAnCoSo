// components/ImageUploader.tsx
/** @jsxImportSource @emotion/react */
import React from "react";
import { Plus } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  previewContainerStyle,
  previewImageStyle,
  resetButtonStyle,
  uploaderContainerStyle,
  hiddenInputStyle,
  labelStyle,
  plusIconContainerStyle,
  plusIconStyle,
  textContainerStyle,
  mainTextStyle,
  subTextStyle,
  supportTextStyle,
} from "../styles/imageUploaderStyles";

interface ImageUploaderProps {
  onImageChange: (file: File, preview: string) => void;
  preview?: string | null;
  onReset: () => void;
  width?: string | number;
  height?: string | number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageChange,
  preview,
  onReset,
  width = "100%",
  height = "600px",
}) => {
  const { handleDrop, handleChange } = useImageUpload(onImageChange);

  if (preview) {
    return (
      <div css={previewContainerStyle}>
        <img src={preview} alt="Preview" css={previewImageStyle} />
        <button onClick={onReset} css={resetButtonStyle}>
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      css={uploaderContainerStyle({ width, height })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="image-upload"
        css={hiddenInputStyle}
        onChange={handleChange}
        accept="image/*"
      />
      <label htmlFor="image-upload" css={labelStyle}>
        <div css={plusIconContainerStyle}>
          <span css={plusIconStyle}>
            <Plus />
          </span>
        </div>
        <div css={textContainerStyle}>
          <p css={mainTextStyle}>Kéo thả ảnh vào đây</p>
          <p css={subTextStyle}>hoặc click để chọn file</p>
        </div>
        <div css={supportTextStyle}>Hỗ trợ: JPG, PNG</div>
      </label>
    </div>
  );
};

export default ImageUploader;