/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from "react";
import { css } from "@emotion/react";
import { useEffect } from "react";
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
} from "../styles/enchancementInterfaceStyles";

interface EnhancementInterfaceProps {
  inputPreview: string;
  results: Record<2 | 3 | 4, { lrResized: string; output: string }>;
  scale: 2 | 3 | 4;
  setScale: (scale: 2 | 3 | 4) => void;
  handleSaveAndDownload: () => void;
  handleClear: () => void;
  imageInfo: {
    name: string;
    originalSize: string;
    targetSize: string;
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

  const [imageBounds, setImageBounds] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  useEffect(() => {
    const updateImageBounds = () => {
      if (imageRef.current && containerRef.current) {
        const img = imageRef.current;
        const container = containerRef.current;
        
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;        

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let scaledWidth = containerWidth;
        let scaledHeight = (naturalHeight / naturalWidth) * containerWidth;
        
        if (scaledHeight > containerHeight) {
          scaledHeight = containerHeight;
          scaledWidth = (naturalWidth / naturalHeight) * containerHeight;
        }

        const left = (containerWidth - scaledWidth) / 2;
        const top = (containerHeight - scaledHeight) / 2;      

        setImageBounds({
          top,
          left,
          width: scaledWidth,
          height: scaledHeight,
        });
      }
    };

    if (imageRef.current) {
      if (imageRef.current.complete) {
        updateImageBounds();
      } else {
        imageRef.current.onload = updateImageBounds;
      }
    }

    window.addEventListener("resize", updateImageBounds);
    return () => window.removeEventListener("resize", updateImageBounds);
  }, [lrImage]);

  const dynamicSizeTagLeftStyle = css`
    ${sizeTagLeftStyle};
    top: ${imageBounds.top + 10}px;
    left: ${imageBounds.left + 10}px;
  `;

  const dynamicSizeTagRightStyle = css`
    ${sizeTagRightStyle};
    top: ${imageBounds.top + 10}px;
    left: ${imageBounds.left + imageBounds.width - 10}px;
    transform: translateX(-100%);
  `;

  const dynamicLabelLeftStyle = css`
    ${sizeTagLeftStyle};
    top: ${imageBounds.top + imageBounds.height - 10}px;
    left: ${imageBounds.left + 10}px;
    transform: translateY(-100%);
  `;

  const dynamicLabelRightStyle = css`
    ${sizeTagRightStyle};
    top: ${imageBounds.top + imageBounds.height - 10}px;
    left: ${imageBounds.left + imageBounds.width - 10}px;
    transform: translate(-100%, -100%);
  `;

  return (
    <div ref={containerRef} css={containerStyle}>
      <img
        ref={imageRef}
        src={lrImage}
        alt="Low Resolution"
        css={lrImageStyle}
      />
      <img
        src={hrImage}
        alt="High Resolution"
        css={hrImageStyle(sliderPosition)}
      />
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
      {/* Labels with dynamic positions */}
      <div css={dynamicSizeTagLeftStyle}>{originalSize} px</div>
      <div css={dynamicSizeTagRightStyle}>{targetSize} px</div>
      <div css={dynamicLabelLeftStyle}>{lrLabel}</div>
      <div css={dynamicLabelRightStyle}>{hrLabel}</div>
    </div>
  );
};

const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
  inputPreview,
  results,
  scale,
  setScale,
  handleSaveAndDownload,
  handleClear,
  imageInfo,
}) => {
  const isGuest = localStorage.getItem("guest") !== null;

  return (
    <div css={mainContainerStyle}>
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          {results &&
          results[scale] &&
          results[scale].lrResized &&
          results[scale].output ? (
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
              {isGuest
                ? "Hãy đăng kí tài khoản để có thể trải nghiệm được tính năng cao cấp"
                : ""}
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
                  disabled={isGuest && value > 2}
                >
                  {value}x
                </button>
              ))}
            </div>
          </div>
          <div css={actionButtonsStyle}>
            <button onClick={handleSaveAndDownload} css={submitButtonStyle}>
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