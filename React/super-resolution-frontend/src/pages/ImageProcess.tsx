// src/pages/ImageProcess.tsx
import React, { useState } from 'react';
import { saveImageHistory, getImageHistory } from '../services/api';
import { ImageHistoryResponse } from '../types/api'; // Thêm import này
import { Button, Container, Typography, Box } from '@mui/material';

const ImageProcess: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ImageHistoryResponse | null>(null);
  const userId = localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id')!) : undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImage(reader.result as string); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!inputImage) return;
    const base64Image = inputImage.split(',')[1]; // Loại bỏ "data:image/png;base64,"
    try {
      await saveImageHistory({
        user_id: userId,
        session_id: undefined,
        input_image: base64Image,
        output_image: base64Image, // Giả lập output = input
        scale: 2,
      });
      const historyData = await getImageHistory(userId);
      setHistory(historyData);
    } catch (error) {
      console.error('Lỗi khi xử lý ảnh:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Xử lý ảnh</Typography>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {inputImage && <img src={inputImage} alt="Input" style={{ maxWidth: '300px' }} />}
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!inputImage}>
        Xử lý
      </Button>
      {history && (
        <Box mt={4}>
          <Typography variant="h5">Lịch sử xử lý</Typography>
          {Object.entries(history).map(([key, item]) => (
            <Box key={key} mt={2}>
              <Typography>{key}</Typography>
              <img src={`data:image/png;base64,${item.input_image}`} alt="Input" style={{ maxWidth: '200px' }} />
              <img src={`data:image/png;base64,${item.output_image}`} alt="Output" style={{ maxWidth: '200px' }} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ImageProcess;