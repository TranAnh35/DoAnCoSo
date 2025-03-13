// src/pages/ImageProcess.tsx
import React, { useState, useEffect } from 'react';
import { processImage, getImageHistory, evaluateQuality, saveImageHistory } from '../services/api';
import { ImageHistoryResponse, ProcessImageResponse, QualityEvaluationResponse, ImageHistoryRequest } from '../types/api';
import { Button, Container, Typography, Box, Tabs, Tab, TextField, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const ImageProcess: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [lrResized, setLrResized] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [history, setHistory] = useState<ImageHistoryResponse | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [srImage, setSrImage] = useState<File | null>(null);
  const [hrImage, setHrImage] = useState<File | null>(null);
  const [srPreview, setSrPreview] = useState<string | null>(null);
  const [hrPreview, setHrPreview] = useState<string | null>(null);
  const [psnr, setPsnr] = useState<number | null>(null);
  const [ssim, setSsim] = useState<number | null>(null);

  const userId = localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id')!) : undefined;

  // Tab Super Resolution
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setInputPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!inputImage) {
      alert("Vui lòng chọn một ảnh để xử lý!");
      return;
    }
  
    try {
      // Xử lý ảnh
      const response: ProcessImageResponse = await processImage(inputImage, scale);
      const lrResizedBase64 = `data:image/png;base64,${response.lr_resized}`;
      const outputBase64 = `data:image/png;base64,${response.output}`;
      setLrResized(lrResizedBase64);
      setOutputImage(outputBase64);
  
      // Lưu lịch sử (nếu cần)
      if (userId) {
        const historyRequest: ImageHistoryRequest = {
          user_id: userId,
          input_image: inputPreview!.split(',')[1], // Lấy phần base64 từ data URL
          output_image: response.output,
          scale: scale,
        };
        await saveImageHistory(historyRequest);
      }
  
      // Cập nhật lịch sử
      const historyData = await getImageHistory(userId);
      setHistory(historyData);
    } catch (error: any) {
      console.error('Lỗi khi xử lý ảnh:', error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra khi xử lý ảnh!");
    }
  };

  const handleClear = () => {
    setInputImage(null);
    setInputPreview(null);
    setOutputImage(null);
    setLrResized(null);
  };

  // Tab Đánh giá chất lượng
  const handleSrImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSrImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setSrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHrImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHrImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setHrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = async () => {
    if (!srImage || !hrImage) return;
    try {
      const response: QualityEvaluationResponse = await evaluateQuality(srImage, hrImage);
      setPsnr(response.psnr);
      setSsim(response.ssim);
    } catch (error) {
      console.error('Lỗi khi đánh giá:', error);
    }
  };

  // Tab Lịch sử
  useEffect(() => {
    if (tab === 2 && userId) {
      getImageHistory(userId).then(setHistory).catch(console.error);
    }
  }, [tab, userId]);

  const handleRefreshHistory = () => {
    if (userId) {
      getImageHistory(userId).then(setHistory).catch(console.error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Super Resolution
      </Typography>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
        <Tab label="🌟 Super Resolution" />
        <Tab label="📊 Đánh giá chất lượng" />
        <Tab label="📜 Lịch sử" />
      </Tabs>

      {/* Tab Super Resolution */}
      {tab === 0 && (
        <Box mt={2}>
          <Box display="flex" flexDirection="row" gap={2}>
            <Box flex={1}>
              <Typography variant="h6">🖼️ Tải ảnh lên</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {inputPreview && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Ảnh đầu vào:</Typography>
                  <img src={inputPreview} alt="Input Preview" style={{ maxWidth: '300px' }} />
                </Box>
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>📏 Chọn tỷ lệ</InputLabel>
                <Select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
                  <MenuItem value={2}>2x</MenuItem>
                  <MenuItem value={3}>3x</MenuItem>
                  <MenuItem value={4}>4x</MenuItem>
                </Select>
              </FormControl>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!inputImage}>
                  ✨ Xử lý ảnh
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClear} sx={{ ml: 2 }}>
                  🗑️ Xóa tất cả
                </Button>
              </Box>
            </Box>
            <Box flex={2}>
              <Typography variant="h6">🎨 Kết quả</Typography>
              <Box display="flex" gap={2}>
                {lrResized && (
                  <Box>
                    <Typography variant="subtitle1">Ảnh LR Resized:</Typography>
                    <img src={lrResized} alt="LR Resized" style={{ maxWidth: '300px' }} />
                  </Box>
                )}
                {outputImage && (
                  <Box>
                    <Typography variant="subtitle1">Ảnh siêu phân giải:</Typography>
                    <img src={outputImage} alt="Output" style={{ maxWidth: '300px' }} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Tab Đánh giá chất lượng */}
      {tab === 1 && (
        <Box mt={2}>
          <Box display="flex" flexDirection="row" gap={2}>
            <Box flex={1}>
              <Typography variant="h6">📷 Tải ảnh so sánh</Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <input type="file" accept="image/*" onChange={handleSrImageChange} />
                <input type="file" accept="image/*" onChange={handleHrImageChange} />
                <Button variant="contained" color="primary" onClick={handleEvaluate} disabled={!srImage || !hrImage}>
                  📈 Đánh giá
                </Button>
              </Box>
            </Box>
            <Box flex={2}>
              <Typography variant="h6">📏 Chỉ số chất lượng</Typography>
              <Box display="flex" gap={2}>
                <TextField label="PSNR" value={psnr ?? ''} InputProps={{ readOnly: true }} />
                <TextField label="SSIM" value={ssim ?? ''} InputProps={{ readOnly: true }} />
              </Box>
              <Typography variant="caption">
                *PSNR cao hơn và SSIM gần 1 cho thấy chất lượng tốt hơn.*
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            {srPreview && <img src={srPreview} alt="SR Preview" style={{ maxWidth: '200px' }} />}
            {hrPreview && <img src={hrPreview} alt="HR Preview" style={{ maxWidth: '200px' }} />}
          </Box>
        </Box>
      )}

      {/* Tab Lịch sử */}
      {tab === 2 && (
        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel>🕒 Chọn lịch sử</InputLabel>
            <Select
              value={selectedHistory || ''}
              onChange={(e) => setSelectedHistory(e.target.value as string)}
            >
              {history && Object.keys(history).length > 0
                ? Object.keys(history).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))
                : <MenuItem value="Chưa có lịch sử">Chưa có lịch sử</MenuItem>}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleRefreshHistory} sx={{ mt: 2 }}>
            🔄 Làm mới lịch sử
          </Button>
          {selectedHistory && history && history[selectedHistory] && (
            <Box display="flex" gap={2} mt={2}>
              <img
                src={`data:image/png;base64,${history[selectedHistory].input_image}`}
                alt="Input"
                style={{ maxWidth: '300px' }}
              />
              <img
                src={`data:image/png;base64,${history[selectedHistory].output_image}`}
                alt="Output"
                style={{ maxWidth: '300px' }}
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ImageProcess;