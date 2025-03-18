// component/EnhancementInterface.ts
/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import {
  mainContainerStyle,
  previewSectionStyle,
  previewBoxStyle,
  previewImageStyle,
  controlsSectionStyle,
  controlsContentStyle,
  headerStyle,
  headerTextStyle,
  infoBoxStyle,
  infoTextStyle,
  notiTextStyle,
  labelStyle,
  scaleButtonsStyle,
  scaleButtonStyle,
  actionButtonsStyle,
  submitButtonStyle,
  iconStyle,
  clearButtonStyle,
  containerStyle,
  lrImageStyle,
  hrImageStyle,
  sliderStyle,
  dividerContainerStyle,
  dividerStyle,
  leftArrowStyle,
  rightArrowStyle,
  sizeTagLeftStyle,
  sizeTagRightStyle,
  labelLeftStyle,
  labelRightStyle,
} from "../styles/enchancementInterfaceStyles";

interface EnhancementInterfaceProps {
  inputPreview: string;
  results: Record<2 | 3 | 4, { lrResized: string; output: string }>;
  scale: 2 | 3 | 4;
  setScale: (scale: 2 | 3 | 4) => void;
  handleSave: () => void;
  handleClear: () => void;
  imageInfo: {
    name: string;
    originalSize: string; // Kích thước ảnh LR
    targetSize: string;   // Kích thước ảnh HR
  };
}

const ComparisonSlider: React.FC<{
  lrImage: string;
  hrImage: string;
  originalSize: string;
  targetSize: string;
  lrLabel: string;
  hrLabel: string;
}> = ({ lrImage, hrImage, originalSize, targetSize, lrLabel, hrLabel }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div css={containerStyle}>
      <img src={lrImage} alt="Low Resolution" css={lrImageStyle} /> {/* LR bên trái */}
      <img src={hrImage} alt="High Resolution" css={hrImageStyle(sliderPosition)} /> {/* HR bên phải */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        css={sliderStyle}
      />
      <div css={dividerContainerStyle(sliderPosition)}>
        <div css={dividerStyle} />
        <div css={leftArrowStyle}>
          <ChevronLeft />
        </div>
        <div css={rightArrowStyle}>
          <ChevronRight />
        </div>
      </div>
      {/* Hiển thị kích thước ở hai góc trên */}
      <div css={sizeTagLeftStyle}>{originalSize} px</div>
      <div css={sizeTagRightStyle}>{targetSize} px</div>
      {/* Hiển thị label ở hai góc dưới */}
      <div css={labelLeftStyle}>{lrLabel}</div>
      <div css={labelRightStyle}>{hrLabel}</div>
    </div>
  );
};

const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
  inputPreview,
  results,
  scale,
  setScale,
  handleSave,
  handleClear,
  imageInfo,
}) => {
  // Kiểm tra trạng thái đăng nhập từ localStorage
  const isGuest = localStorage.getItem("guest") !== null;

  return (
    <div css={mainContainerStyle}>
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          {results && results[scale] && results[scale].lrResized && results[scale].output ? (
            <ComparisonSlider
              lrImage={results[scale].lrResized}
              hrImage={results[scale].output}
              originalSize={imageInfo.originalSize}
              targetSize={imageInfo.targetSize}
              lrLabel="Ảnh gốc"
              hrLabel="Ảnh nâng cấp"
            />
          ) : (
            <div>
              <img src={inputPreview} alt="Preview" css={previewImageStyle} />
              <p>Đang chờ xử lý ảnh hoặc không có dữ liệu...</p>
            </div>
          )}
        </div>
      </div>

      <div css={controlsSectionStyle}>
        <div css={controlsContentStyle}>
          <div css={headerStyle}>
            <h2 css={headerTextStyle}>Tùy chọn nâng cấp</h2>
          </div>
          <div css={infoBoxStyle}>
            <p css={infoTextStyle}>
              Chọn hệ số kích thước để xem kết quả nâng cấp.
            </p>
            <p css={notiTextStyle}>
              {isGuest ? (
                "Hãy đăng kí tài khoản để có thể trải nghiệm được tính năng cao cấp"
              ) : (
                ""
              )}
            </p>
          </div>
          <div>
            <label css={labelStyle}>Hệ số kích thước</label>
            <div css={scaleButtonsStyle}>
              {[2, 3, 4].map((value) => (
                <button
                  key={value}
                  onClick={() => setScale(value as 2 | 3 | 4)}
                  css={scaleButtonStyle(scale === value)}
                  disabled={isGuest && value > 2} // Khóa 3x và 4x khi là guest
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>
          {/* Di chuyển nút Lưu và Quay lại xuống dưới cùng */}
          <div css={actionButtonsStyle}>
            <button onClick={handleSave} css={submitButtonStyle}>
              <span css={iconStyle}>
                <ZoomIn />
              </span>
              <span>Lưu</span>
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

export default EnhancementInterface;