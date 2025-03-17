// src/types/api.ts
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserSignin {
  username: string;
  password: string;
}

export interface AuthResponse {
  user_id?: number;
  errors: {
    username?: string;
    email?: string;
    password?: string;
    global?: string;
  };
  success: boolean;
}

export interface GuestSessionResponse {
  session_id: number;
  session_token: string;
}

export interface ImageHistoryRequest {
  user_id?: number;
  session_id?: number;
  input_image: string; // base64 encoded string
  output_image: string; // base64 encoded string
  scale: number;
}

export interface ImageHistoryItem {
  input_image: string; // base64
  output_image: string; // base64
  scale: number;
  timestamp: string;
}

export interface ImageHistoryResponse {
  [key: string]: ImageHistoryItem;
}

export interface ProcessImageResponse {
  lr_resized: string; // base64 encoded string
  output: string; // base64 encoded string
}

export interface QualityEvaluationResponse {
  psnr: number;
  ssim: number;
  error?: string;
}