/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from "react";
import { css } from "@emotion/react";
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
  actionButtonsStyle,
  submitButtonStyle,
  iconStyle,
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
import { FormControl, InputLabel, Select, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

interface HistoryFormProps {
  history: any;
  selectedHistory: string;
  setSelectedHistory: (value: string) => void;
  handleRefreshHistory: () => void;
  handleDownload: () => void;
}

const ComparisonSlider: React.FC<{
  lrImage: string;
  hrImage: string;
  lrLabel: string;
  hrLabel: string;
}> = ({ lrImage, hrImage, lrLabel, hrLabel }) => {
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

        // Get container dimensions
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
      <div css={dynamicSizeTagLeftStyle}>{lrLabel}</div>
      <div css={dynamicSizeTagRightStyle}>{hrLabel}</div>
    </div>
  );
};

const HistoryForm: React.FC<HistoryFormProps> = ({
  history,
  selectedHistory,
  setSelectedHistory,
  handleRefreshHistory,
  handleDownload,
}) => {
  return (
    <div css={mainContainerStyle}>
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          {selectedHistory && history && history[selectedHistory] ? (
            <ComparisonSlider
              lrImage={`data:image/png;base64,${history[selectedHistory].input_image}`}
              hrImage={`data:image/png;base64,${history[selectedHistory].output_image}`}
              lrLabel="Ảnh gốc"
              hrLabel="Ảnh nâng cấp"
            />
          ) : (
            <div>
              <p css={previewImageStyle}>Vui lòng chọn lịch sử để xem ảnh</p>
            </div>
          )}
        </div>
      </div>

      <div css={controlsSectionStyle}>
        <div css={controlsContentStyle}>
          <div css={headerStyle}>
            <h2 css={headerTextStyle}>Lịch sử nâng cấp</h2>
          </div>
          <div css={infoBoxStyle}>
            <p css={infoTextStyle}>
              Chọn thời điểm trong lịch sử để xem kết quả nâng cấp đã thực hiện.
            </p>
          </div>
          <FormControl fullWidth>
            <InputLabel>🕒 Chọn lịch sử</InputLabel>
            <Select
              value={selectedHistory || ""}
              onChange={(e) => setSelectedHistory(e.target.value as string)}
              label="Chọn lịch sử"
            >
              {history && Object.keys(history).length > 0 ? (
                Object.keys(history).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Chưa có lịch sử</MenuItem>
              )}
            </Select>
          </FormControl>
          <div css={actionButtonsStyle}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefreshHistory}
              css={submitButtonStyle}
            >
              <span css={iconStyle}>
                <ZoomIn />
              </span>
              <span>Làm mới</span>
            </Button>
            <button onClick={handleDownload} css={submitButtonStyle}>
              Tải xuống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryForm;