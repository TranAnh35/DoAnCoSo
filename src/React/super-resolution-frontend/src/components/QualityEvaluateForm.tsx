/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { ZoomIn } from "lucide-react";
import ImageUploader from "./ImageUploader"; // Giả sử bạn đã có component này
import {
  mainContainerStyle,
  previewSectionStyle,
  previewBoxStyle,
  controlsSectionStyle,
  controlsContentStyle,
  headerStyle,
  headerTextStyle,
  infoBoxStyle,
  infoTextStyle,
  labelStyle,
  actionButtonsStyle,
  submitButtonStyle,
  iconStyle,
  metricBoxStyle,
  metricLabelStyle,
  metricValueStyle,
} from "../styles/enchancementInterfaceStyles"; // Tái sử dụng các style từ EnhancementInterface

interface QualityEvaluateFormProps {
  srPreview: string | null;
  hrPreview: string | null;
  psnr: number | null;
  ssim: number | null;
  handleSrImageChange: (file: File, preview: string) => void;
  handleHrImageChange: (file: File, preview: string) => void;
  handleEvaluate: () => void;
  handleResetSrImage: () => void;
  handleResetHrImage: () => void;
}

const QualityEvaluateForm: React.FC<QualityEvaluateFormProps> = ({
  srPreview,
  hrPreview,
  psnr,
  ssim,
  handleSrImageChange,
  handleHrImageChange,
  handleEvaluate,
  handleResetSrImage,
  handleResetHrImage,
}) => {
  return (
    <div css={mainContainerStyle}>
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              height: 100%;
            `}
          >
            <div css={css`flex: 1;`}>
              <ImageUploader
                onImageChange={handleSrImageChange}
                onReset={handleResetSrImage}
                preview={srPreview}
                height='70vh'
              />
            </div>
            <div css={css`flex: 1;`}>
              <ImageUploader
                onImageChange={handleHrImageChange}
                onReset={handleResetHrImage}
                preview={hrPreview}
                height='70vh'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phần controls với PSNR, SSIM và nút Tính toán */}
      <div css={controlsSectionStyle}>
        <div css={controlsContentStyle}>
          <div css={headerStyle}>
            <h2 css={headerTextStyle}>Đánh giá chất lượng</h2>
          </div>
          <div css={infoBoxStyle}>
            <p css={infoTextStyle}>
              Tải lên ảnh SR và HR để tính toán chỉ số PSNR và SSIM.
            </p>
          </div>
          <div>
            <label css={labelStyle}>Chỉ số chất lượng</label>
            <div
              css={css`
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
              `}
            >
              <div css={metricBoxStyle}>
                <span css={metricLabelStyle}>PSNR</span>
                <span css={metricValueStyle}>{psnr !== null ? psnr : "-"}</span>
              </div>
              <div css={metricBoxStyle}>
                <span css={metricLabelStyle}>SSIM</span>
                <span css={metricValueStyle}>{ssim !== null ? ssim : "-"}</span>
              </div>
            </div>
          </div>
          {/* Nút Tính toán */}
          <div css={actionButtonsStyle}>
            <button onClick={handleEvaluate} css={submitButtonStyle}>
              <span css={iconStyle}>
                <ZoomIn />
              </span>
              <span>Tính toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityEvaluateForm;