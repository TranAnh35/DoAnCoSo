// import React from "react";
// import { Box, Button, Typography } from "@mui/material";
// import "../styles/ImageProcess.css";

// interface ImageUploaderProps {
//   label: string;
//   id: string;
//   onImageChange: (file: File, preview: string) => void;
//   onReset: () => void;
//   preview?: string | null;
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({ label, id, onImageChange, onReset, preview }) => {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => onImageChange(file, reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Box className="quality-upload-item">
//       <Typography variant="h2" gutterBottom>
//         {label}
//       </Typography>
//       {!preview ? (
//         <>
//           <input type="file" id={id} style={{ display: "none" }} onChange={handleChange} />
//           <label htmlFor={id}>
//             <Button variant="contained" component="span" className="upload-button">
//               Chọn ảnh
//             </Button>
//           </label>
//         </>
//       ) : (
//         <>
//           <img src={preview} alt={label} className="quality-image" />
//           <Button variant="outlined" onClick={onReset} className="reset-button">
//             Quay lại
//           </Button>
//         </>
//       )}
//     </Box>
//   );
// };

// export default ImageUploader;

/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { Plus } from 'lucide-react';
import { css } from '@emotion/react';

interface ImageUploaderProps {
  onImageChange: (file: File, preview: string) => void;
  preview?: string | null;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, preview, onReset }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(file, reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(file, reader.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

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
      css={uploaderContainerStyle}
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

// Emotion styles (giữ nguyên)
const previewContainerStyle = css`
  position: relative;
  width: 100%;
`;

const previewImageStyle = css`
  width: 100%;
  height: 600px;
  object-fit: contain;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const resetButtonStyle = css`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #f3f4f6;
  }
`;

const uploaderContainerStyle = css`
  width: 100%;
  min-width: 800px;
  min-height: 600px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f9fafb;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #f3f4f6;
  }
`;

const hiddenInputStyle = css`
  display: none;
`;

const labelStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const plusIconContainerStyle = css`
  width: 48px;
  height: 48px;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const plusIconStyle = css`
  width: 24px;
  height: 24px;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const textContainerStyle = css`
  text-align: center;
`;

const mainTextStyle = css`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

const subTextStyle = css`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

const supportTextStyle = css`
  margin-top: 16px;
  font-size: 12px;
  color: #9ca3af;
`;

export default ImageUploader;