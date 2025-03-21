import { css } from '@emotion/react';

export const mainContainerStyle = css`
  display: flex;
  height: 92vh;
  width: 100vw;
  background-color: #f9fafb;
`;

export const previewSectionStyle = css`
  flex: 1;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const previewBoxStyle = css`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-width: 100%;
   max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const previewImageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Thay đổi từ contain thành cover */
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
  color: rgb(255, 145, 0);
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
    background-color: #f0f0f0;
    color: #999;
    border-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
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
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const lrImageStyle = css`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const hrImageStyle = (sliderPosition: number) => css`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

// export const labelLeftStyle = css`
//   position: absolute;
//   bottom: 20px;
//   left: 20px;
//   color: rgba(0, 0, 0, 0.5);
//   padding: 5px 10px;
//   font-size: 14px;
//   z-index: 10;
// `;

// export const labelRightStyle = css`
//   position: absolute;
//   bottom: 20px;
//   right: 20px;
//   color: #2196f3;
//   padding: 5px 10px;
//   font-size: 14px;
//   z-index: 10;
// `;

// export const sizeTagLeftStyle = css`
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   background-color: rgba(0, 0, 0, 0.5);
//   color: white;
//   padding: 5px 10px;
//   border-radius: 5px;
//   font-size: 12px;
//   z-index: 10;
// `;

// export const sizeTagRightStyle = css`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background-color: #2196f3;
//   color: white;
//   padding: 5px 10px;
//   border-radius: 5px;
//   font-size: 12px;
//   z-index: 10;
// `;

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
  width: 80px;
  text-align: center;
`;

export const sizeTagRightStyle = css`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color:rgba(33, 149, 243, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 10;
  width: 80px;
  text-align: center;
`;