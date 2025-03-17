// import React from "react";
// import { Box, Typography, FormControl, InputLabel, Select, Button } from "@mui/material";
// import MenuItem from "@mui/material/MenuItem";
// import "../styles/ImageProcess.css";

// interface EnhancementInterfaceProps {
//   inputPreview: string;
//   scale: number;
//   setScale: React.Dispatch<React.SetStateAction<number>>;
//   handleSubmit: () => void;
//   handleClear: () => void;
// }

// const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
//   inputPreview,
//   scale,
//   setScale,
//   handleSubmit,
//   handleClear,
// }) => {
//   return (
//     <Box className="enhancement-container">
//       <Box className="preview-container">
//         <img src={inputPreview} alt="Preview" className="preview-image" />
//       </Box>
//       <Box className="options-container">
//         <Typography variant="h6" gutterBottom>
//           Tùy chọn nâng cấp
//         </Typography>
//         <FormControl fullWidth className="form-control">
//           <InputLabel id="scale-select-label">Chọn kích thước</InputLabel>
//           <Select
//             labelId="scale-select-label"
//             value={scale}
//             label="Chọn kích thước"
//             onChange={(e) => setScale(Number(e.target.value))}
//           >
//             <MenuItem value={2}>2x</MenuItem>
//             <MenuItem value={3}>3x</MenuItem>
//             <MenuItem value={4}>4x</MenuItem>
//           </Select>
//         </FormControl>
//         <Box className="options-buttons">
//           <Button variant="outlined" onClick={handleClear} className="back-button">
//             Quay lại
//           </Button>
//           <Button variant="contained" color="primary" onClick={handleSubmit} className="submit-button">
//             Nâng cấp
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default EnhancementInterface;

/** @jsxImportSource @emotion/react */
import React from 'react';
import { ZoomIn } from 'lucide-react';
import { css } from '@emotion/react';

interface EnhancementInterfaceProps {
  inputPreview: string;
  scale: 2 | 3 | 4;
  setScale: (scale: 2 | 3 | 4) => void;
  handleSubmit: () => void;
  handleClear: () => void;
  imageInfo: {
    name: string;
    originalSize: string;
    targetSize: string;
  };
}

const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
  inputPreview,
  scale,
  setScale,
  handleSubmit,
  handleClear,
  imageInfo,
}) => {
  return (
    <div css={mainContainerStyle}>
      {/* Preview Section */}
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          <div css={sizeTagStyle}>{imageInfo.originalSize}</div>
          <img src={inputPreview} alt="Preview" css={previewImageStyle} />
          <div css={footerStyle}>
            <span css={fileNameStyle}>{imageInfo.name}</span>
            <div css={sizeInfoStyle}>
              <span css={originalSizeStyle}>{imageInfo.originalSize}</span>
              <span css={arrowStyle}>→</span>
              <span css={targetSizeStyle}>{imageInfo.targetSize}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div css={controlsSectionStyle}>
        <div css={controlsContentStyle}>
          {/* Header */}
          <div css={headerStyle}>
            <h2 css={headerTextStyle}>
              Tùy chọn nâng cấp
            </h2>
          </div>

          {/* Info Box */}
          <div css={infoBoxStyle}>
            <p css={infoTextStyle}>
              Chọn hệ số kích thước rồi nhập vào "Tăng kích thước" để tăng kích thước mọi ảnh nhỏ hơn 2MP
            </p>
          </div>

          {/* Scale Selection */}
          <div>
            <label css={labelStyle}>Hệ số kích thước</label>
            <div css={scaleButtonsStyle}>
              {[2, 3, 4].map((value) => (
                <button
                  key={value}
                  onClick={() => setScale(value as 2 | 3 | 4)}
                  css={scaleButtonStyle(scale === value)}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div css={actionButtonsStyle}>
            <button onClick={handleSubmit} css={submitButtonStyle}>
              <span css={iconStyle}>
                <ZoomIn />
              </span>
              <span>Nâng cấp</span>
            </button>
            <button onClick={handleClear} css={clearButtonStyle}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Emotion styles (giữ nguyên)
const mainContainerStyle = css`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
  margin-top: 32px; 
`;

const previewSectionStyle = css`
  flex: 1;
  padding: 32px;
`;

const previewBoxStyle = css`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const sizeTagStyle = css`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(31, 41, 55, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
`;

const previewImageStyle = css`
  width: 100%;
  height: calc(100vh - 120px);
  object-fit: contain;
`;

const footerStyle = css`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const fileNameStyle = css`
  font-size: 14px;
  color: #6b7280;
`;

const sizeInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const originalSizeStyle = css`
  font-size: 14px;
  color: #6b7280;
`;

const arrowStyle = css`
  color: #9ca3af;
`;

const targetSizeStyle = css`
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
`;

const controlsSectionStyle = css`
  width: 320px;
  background-color: white;
  border-left: 1px solid #e5e7eb;
  padding: 24px;
  overflow-y: auto;
`;

const controlsContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const headerStyle = css`
  display: flex;
  align-items: center;
`;

const headerTextStyle = css`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const infoBoxStyle = css`
  background-color: #dbeafe;
  padding: 16px;
  border-radius: 8px;
`;

const infoTextStyle = css`
  font-size: 14px;
  color: #1e40af;
`;

const labelStyle = css`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const scaleButtonsStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const scaleButtonStyle = (isActive: boolean) => css`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${isActive ? '#bfdbfe' : '#e5e7eb'};
  background-color: ${isActive ? '#eff6ff' : '#f9fafb'};
  color: ${isActive ? '#1d4ed8' : '#374151'};
  cursor: pointer;
  &:hover {
    background-color: ${isActive ? '#dbeafe' : '#f3f4f6'};
  }
`;

const actionButtonsStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const submitButtonStyle = css`
  width: 100%;
  background-color: #2563eb;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const iconStyle = css`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const clearButtonStyle = css`
  width: 100%;
  background-color: #f3f4f6;
  color: #374151;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

export default EnhancementInterface;