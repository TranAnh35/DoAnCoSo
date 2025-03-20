// styles/imageUploaderStyles.ts
import { css } from '@emotion/react';

export const previewContainerStyle = css`
  position: relative;
  width: 100%;
`;

export const previewImageStyle = css`
  width: 100%;
  height: 600px;
  object-fit: contain;
  background-color: #f9fafb;
  border-radius: 8px;
`;

export const resetButtonStyle = css`
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

export const uploaderContainerStyle = ({ width, height }: { width: string | number; height: string | number }) => css`
  width: ${typeof width === 'number' ? `${width}px` : width};
  height: ${typeof height === 'number' ? `${height}px` : height};
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

export const hiddenInputStyle = css`
  display: none;
`;

export const labelStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const plusIconContainerStyle = css`
  width: 48px;
  height: 48px;
  background-color: #dbeafe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const plusIconStyle = css`
  width: 24px;
  height: 24px;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const textContainerStyle = css`
  text-align: center;
`;

export const mainTextStyle = css`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
`;

export const subTextStyle = css`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

export const supportTextStyle = css`
  margin-top: 16px;
  font-size: 12px;
  color: #9ca3af;
`;