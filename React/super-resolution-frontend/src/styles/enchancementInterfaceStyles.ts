// styles/enhancementInterfaceStyles.ts
import { css } from '@emotion/react';

export const mainContainerStyle = css`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
  margin-top: 32px; 
`;

export const previewSectionStyle = css`
  flex: 1;
  padding: 32px;
`;

export const previewBoxStyle = css`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const sizeTagStyle = css`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(31, 41, 55, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
`;


export const previewImageStyle = css`
  width: 100%;
  height: calc(100vh - 120px);
  object-fit: contain;
`;

export const footerStyle = css`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const fileNameStyle = css`
  font-size: 14px;
  color: #6b7280;
`;

export const sizeInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const originalSizeStyle = css`
  font-size: 14px;
  color: #6b7280;
`;

export const targetSizeStyle = css`
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
`;

export const controlsSectionStyle = css`
  width: 320px;
  background-color: white;
  border-left: 1px solid #e5e7eb;
  padding: 24px;
  overflow-y: auto;
`;

export const controlsContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const headerStyle = css`
  display: flex;
  align-items: center;
`;

export const headerTextStyle = css`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const infoBoxStyle = css`
  background-color: #dbeafe;
  padding: 16px;
  border-radius: 8px;
`;

export const infoTextStyle = css`
  font-size: 14px;
  color: #1e40af;
`;

export const notiTextStyle = css`
  font-size: 14px;
  color:rgb(255, 145, 0);
`;

export const labelStyle = css`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

export const scaleButtonsStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const scaleButtonStyle = (isActive: boolean) => css`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  border: 1px solid ${isActive ? '#bfdbfe' : '#e5e7eb'};
  background-color: ${isActive ? '#eff6ff' : '#f9fafb'};
  color: ${isActive ? '#1d4ed8' : '#374151'};
  cursor: pointer;

  &:hover {
    background-color: ${isActive ? '#dbeafe' : '#f3f4f6'};
  }
  
  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #f0f0f0; /* Màu xám nhạt khi disabled */
    color: #999; /* Chữ xám để rõ ràng */
    border-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none; /* Loại bỏ hiệu ứng hover/active khi disabled */
  }
`;

export const actionButtonsStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const submitButtonStyle = css`
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

export const iconStyle = css`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const clearButtonStyle = css`
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

export const containerStyle = css`
  position: relative;
  width: 1024px;
  height: 800px;
  overflow: hidden;
`;

export const lrImageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
`;
  
export const hrImageStyle = (sliderPosition: number) => css`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0;
  left: 0;
  clip-path: inset(0 0 0 ${sliderPosition}%);
`;

export const sliderStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
`;

export const dividerContainerStyle = (sliderPosition: number) => css`
  position: absolute;
  top: 0;
  left: ${sliderPosition}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
`;

export const dividerStyle = css`
  width: 2px;
  height: 100%;
  background: white;
  pointer-events: none;
`;

export const arrowStyle = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 24px;
  z-index: 10;
  opacity: 0.7;
  pointer-events: none;
`;

export const leftArrowStyle = css`
  ${arrowStyle};
  left: -40px;
`;

export const rightArrowStyle = css`
  ${arrowStyle};
  left: 20px;
`;

export const sizeTagLeftStyle = css`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 10;
`;

export const sizeTagRightStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #2196f3;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 10;
`;

export const labelLeftStyle = css`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  font-size: 14px;
  z-index: 10;
`;

export const labelRightStyle = css`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #2196f3;
  padding: 5px 10px;
  font-size: 14px;
  z-index: 10;
`;