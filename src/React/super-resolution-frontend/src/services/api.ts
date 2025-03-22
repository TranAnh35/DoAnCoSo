// src/services/api.ts
import axios from 'axios';
import { UserRegister, UserSignin, AuthResponse, GuestSessionResponse, ImageHistoryRequest, ImageHistoryResponse, QualityEvaluationResponse, ProcessImageResponse } from '../types/api';

const API_URL = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserIdFromLocalStorage = (): number | undefined => {
  const userId = localStorage.getItem('user_id');
  return userId ? parseInt(userId) : undefined;
};

export const registerUser = async (data: UserRegister): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data);
  return response.data;
};

export const signinUser = async (data: UserSignin): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/signin', data);
  return response.data;
};

export const getInformation = async (userId?: number, info: string = 'username'): Promise<any> => {
  const effectiveUserId = userId ?? getUserIdFromLocalStorage();
  if (!effectiveUserId) {
    throw new Error('User ID is required. Please sign in.');
  }

  const response = await api.get<any>(`/user/info`, {
    params: { user_id: effectiveUserId, info },
  });
  return response.data;
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<{ message: string | { [key: string]: string } }> => {
  const response = await api.post<{ message: string | { [key: string]: string } }>(`/user/change-password`, {
    user_id: userId,
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
};

export const changeInformation = async (userId: number, newUsername: string, newEmail: string): Promise<{ message: string | { [key: string]: string } }> => {
  const response = await api.post<{ message: string | { [key: string]: string } }>(`/user/change-information`, {
    user_id: userId,
    new_username: newUsername,
    new_email: newEmail,
  }); 
  return response.data;
}

export const createGuestSession = async (): Promise<GuestSessionResponse> => {
  const response = await api.post<GuestSessionResponse>('/guest/create');
  return response.data;
};

export const dropGuestSession = async (sessionId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/guest/drop?session_id=${sessionId}`);
  return response.data;
};

export const saveImageHistory = async (data: ImageHistoryRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/image/history/save', data);
  return response.data;
};

export const getImageHistory = async (userId?: number, sessionId?: number): Promise<ImageHistoryResponse> => {
  const params = userId ? { user_id: userId } : { session_id: sessionId };
  const response = await api.get<ImageHistoryResponse>('/image/history', { params });
  return response.data;
};

export const removeImageHistory = async (sessionId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/image/history/remove?session_id=${sessionId}`);
  return response.data;
};

export const processImage = async (file: File, scale: number): Promise<ProcessImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('scale', scale.toString());

  const response = await api.post<ProcessImageResponse>('/process-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const evaluateQuality = async (srImage: File, hrImage: File): Promise<QualityEvaluationResponse> => {
  const formData = new FormData();
  formData.append('sr_image', srImage);
  formData.append('hr_image', hrImage);

  const response = await api.post<QualityEvaluationResponse>('/evaluate-quality', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};