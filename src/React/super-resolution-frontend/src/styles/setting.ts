import { css } from "@emotion/react";

export const mainContainerStyle = css`
  display: flex;
  height: calc(100vh - 64px); /* Chiều cao trừ đi header */
  width: 100%;
  background-color: #f9fafb;
  overflow: hidden;
`;

export const sidebarStyle = css`
  width: 250px;
  background-color: white;
  padding: 2rem;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: hidden;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
    height: auto;
  }
`;

export const sidebarItemStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #374151;
  &:hover {
    color: #2563eb;
  }
`;

export const sidebarItemActiveStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #2563eb;
  font-weight: 500;
`;

export const contentStyle = css`
  flex: 1;
  padding: 2rem;
  background-color: #f9fafb;
  height: 100%;
  overflow-y: hidden;
  width: 100vh;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const sectionStyle = css`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-height: 100%;
  overflow: hidden;
`;

export const sectionTitleStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const sectionContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const linkStyle = css`
  color: #2563eb;
  font-size: 14px;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

export const changeButtonStyle = css`
  color: #2563eb;
  font-size: 14px;
  text-transform: none;
  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;