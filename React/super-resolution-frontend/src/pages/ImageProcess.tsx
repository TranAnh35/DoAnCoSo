// src/pages/ImageProcess.tsx
import React, { useState, useEffect, useRef } from 'react';
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

  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 400,
  });

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCtrlPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCtrlPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    console.log('Container ref:', container); // Kiểm tra xem ref có giá trị không
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => {
        const newZoom = Math.min(3, Math.max(1, prev + delta));
        console.log('Zoom level updated to:', newZoom); // Log khi zoom thay đổi
        return newZoom;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    console.log('Wheel event listener attached');
    return () => {
      container.removeEventListener('wheel', handleWheel);
      console.log('Wheel event listener removed');
    };
  }, [lrResized, outputImage]);

  useEffect(() => {
    if (outputImage) {
      const img = new Image();
      img.src = outputImage;
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [outputImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCtrlPressed) return; // Chỉ kéo khi giữ Ctrl
    e.preventDefault(); // Ngăn hành vi kéo thả mặc định
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current || !containerRef.current) return;

    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    const zoomedWidth = imageDimensions.width * zoomLevel;
    const zoomedHeight = imageDimensions.height * zoomLevel;
    const maxX = zoomedWidth > 768 ? (zoomedWidth - 768) / 2 : 0;
    const maxY = zoomedHeight > 768 ? (zoomedHeight - 768) / 2 : 0;

    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault(); // Ngăn hành vi kéo thả của thẻ <img>
  };

  const handleDownload = () => {
    if (!outputImage) return;
  
    const link = document.createElement('a');
    link.href = outputImage;
    link.download = `super_resolution_${scale}x.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Box mt={2} display="flex" flexDirection="row" height="80vh">
          {/* Workarea (bên trái) */}
          <Box
            flex={1}
            p={2}
            sx={{
              borderRight: "1px solid #ccc",
              overflowY: "auto", // Tương tự style="overflow-y: auto;" trong HTML
            }}
          >
            {/* Khi chưa chọn file */}
            {!inputImage && (
              <Box
                sx={{
                  textAlign: "center",
                  color: "#707078",
                }}
              >
                <Typography variant="body1">Không có tệp được chọn.</Typography>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="75"
                  height="66"
                  viewBox="0 0 150 132"
                >
                  <path
                    fill="#707078" // Thay #FFF bằng màu xám nhạt để phù hợp
                    d="M0,0 C0,18.75 28.125,56.25 93.75,56.25 L93.75,18.75 L150,75 L93.75,131.25 L93.75,93.75 C42.0594727,93.75 0,51.6905273 0,0 Z"
                    transform="rotate(-180 75 66)"
                  />
                </svg>
                <Typography variant="body1">
                  Hãy thêm tệp để kích hoạt các tùy chọn
                </Typography>
              </Box>
            )}

            {/* Khi đã chọn file */}
            {inputImage && (
              <Box>
                {/* Tiêu đề tùy chọn nâng cấp */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Tùy chọn nâng cấp</Typography>
                </Box>

                {/* Thông báo */}
                <Box
                  sx={{
                    backgroundColor: "#e8f4fd",
                    padding: "8px",
                    borderRadius: "4px",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">
                    Chọn hệ số kích thước rồi nhấp vào "Tăng kích thước" để tăng kích
                    thước mọi ảnh nhỏ hơn 2MP
                  </Typography>
                </Box>

                {/* Hệ số kích thước */}
                <Box mb={2}>
                  <Typography variant="subtitle1">Hệ số kích thước</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {[2, 3, 4].map((value) => (
                      <Button
                        key={value}
                        variant={scale === value ? "contained" : "outlined"}
                        onClick={() => setScale(value)}
                        sx={{
                          minWidth: "60px",
                          textTransform: "none",
                        }}
                      >
                        {value}x
                      </Button>
                    ))}
                  </Box>
                </Box>

                {/* Danh sách file */}
                <Box>
                  {inputPreview && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "50%",
                        }}
                        title={inputImage.name}
                      >
                        {inputImage.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2">256 x 161 px</Typography>
                        <svg
                          width="11"
                          height="10"
                          viewBox="0 0 11 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ margin: "0 8px" }}
                        >
                          <path
                            d="M10.8809 4.94141C10.8809 4.79492 10.8223 4.66016 10.7051 4.54883L6.82031 0.675781C6.69141 0.546875 6.56836 0.5 6.42773 0.5C6.14062 0.5 5.91797 0.710938 5.91797 1.00391C5.91797 1.14453 5.96484 1.2793 6.05859 1.37305L7.37109 2.70898L9.33984 4.50781L7.92773 4.41992H0.515625C0.210938 4.41992 0 4.63672 0 4.94141C0 5.24609 0.210938 5.46289 0.515625 5.46289H7.92773L9.3457 5.375L7.37109 7.17383L6.05859 8.50977C5.96484 8.59766 5.91797 8.73828 5.91797 8.87891C5.91797 9.17188 6.14062 9.38281 6.42773 9.38281C6.56836 9.38281 6.69141 9.33008 6.80859 9.21875L10.7051 5.33398C10.8223 5.22266 10.8809 5.08789 10.8809 4.94141Z"
                            fill="#707078"
                          />
                        </svg>
                        <Typography variant="body2">
                          {256 * scale} x {161 * scale} px
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Nút xử lý */}
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!inputImage}
                  >
                    ✨ Tăng kích thước
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                  >
                    🗑️ Xóa tất cả
                  </Button>
                </Box>
              </Box>
            )}

            {/* Input file ẩn */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload"
            />
            {!inputImage && (
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  sx={{ mt: 2 }}
                >
                  📤 Thêm tệp
                </Button>
              </label>
            )}
          </Box>

          {/* Sidebar (bên phải) */}
          <Box flex={2} p={2} sx={{ position: "relative" }}>
            {/* Header */}
            <Box
              sx={{
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h4">Nâng cấp ảnh</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: "#626870", mt: 1 }}>
                Dễ dàng tăng độ phân giải cho hình ảnh bằng công cụ nâng cấp ảnh tiên
                tiến của chúng tôi.
              </Typography>
            </Box>

            {/* Uploading bar */}
            <Box
              sx={{
                width: "100%",
                height: "4px",
                backgroundColor: "#e0e0e0",
                borderRadius: "2px",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: outputImage ? "100%" : "0%",
                  height: "100%",
                  backgroundColor: "#1976d2",
                  borderRadius: "2px",
                  transition: "width 0.3s",
                }}
              />
            </Box>

            {/* Sidetools */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mb: 2,
              }}
            >
              <Button
                sx={{
                  minWidth: "40px",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#383E45"
                >
                  <path d="M24 14.187V9.813c-2.148-.766-2.726-.802-3.027-1.53s.083-1.17 1.06-3.223L18.94 1.968c-2.026.963-2.488 1.364-3.224 1.06-.727-.302-.768-.89-1.527-3.027H9.813c-.764 2.144-.8 2.725-1.53 3.027-.752.313-1.203-.1-3.223-1.06L1.968 5.06c.977 2.055 1.362 2.493 1.06 3.224S2.146 9.05 0 9.813v4.375c2.14.76 2.725.8 3.027 1.528.304.734-.08 1.167-1.06 3.223l3.093 3.093c2-.95 2.47-1.373 3.223-1.06.728.302.764.88 1.53 3.027h4.374c.758-2.13.8-2.723 1.537-3.03.745-.308 1.186.1 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.06-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.16-1.076-3.573-.5-1.396.58-1.8 1.693-2.188 2.877h-1.534c-.398-1.185-.79-2.297-2.183-2.875-1.42-.588-2.507-.045-3.58.488L4.39 18.53c.557-1.118 1.066-2.18.487-3.58-.58-1.39-1.69-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.79 2.875-2.184s.068-2.46-.488-3.58L5.47 4.387c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.7 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.42.588 2.506.045 3.58-.488l1.084 1.084c-.556 1.12-1.065 2.187-.488 3.58s1.69 1.784 2.875 2.183v1.534c-1.188.398-2.302.79-2.877 2.183zM12 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
                </svg>
              </Button>
              <Button
                sx={{
                  minWidth: "40px",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="22"
                  fill="#383E45"
                >
                  <path
                    fillRule="nonzero"
                    d="M2.947 15.297V.23c0-.067.026-.123.077-.166S3.14 0 3.22 0h1.635c.08 0 .145.022.196.065s.077.1.077.166v15.066h2.5a.39.39 0 0 1 .261.087.28.28 0 0 1 .102.222c0 .077-.038.154-.114.23l-3.62 3.076a.42.42 0 0 1-.261.087c-.09 0-.178-.03-.26-.087L.11 15.828c-.113-.103-.14-.215-.08-.338.06-.13.174-.193.34-.193h2.575z"
                  />
                  <path d="M11.222 20.2l2.94-7.52c.194-.496.555-.67 1.1-.67h.54c.513 0 .97.12 1.22.804l2.746 7.386c.083.214.222.603.222.845 0 .536-.485.965-1.068.965-.5 0-.86-.174-1.026-.603l-.582-1.6h-3.66l-.596 1.6c-.153.43-.47.603-1.012.603-.624 0-1.054-.375-1.054-.965 0-.24.14-.63.222-.845zm5.602-1.93l-1.3-3.874h-.028L14.15 18.27h2.663zM11.346 8l4.75-6.083h-3.66c-.602 0-1.088-.333-1.088-.958S11.832 0 12.434 0h5.53c.538 0 .973.25.973 1.042 0 .278-.102.583-.294.82l-4.826 6.222h4.096c.602 0 1.088.333 1.088.958s-.486.958-1.088.958h-5.696C11.448 10 11 9.722 11 8.875c0-.36.154-.625.346-.875z" />
                </svg>
              </Button>
              <Button
                sx={{
                  minWidth: "40px",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 22 19"
                  fill="#383E45"
                >
                  <path
                    fillRule="evenodd"
                    d="M11 4c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92A11.82 11.82 0 0 0 21.99 9c-1.73-4.4-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C9.74 4.13 10.35 4 11 4zM1 1.27L3.74 4A11.8 11.8 0 0 0 0 9c1.73 4.4 6 7.5 11 7.5a11.78 11.78 0 0 0 4.38-.84l.42.42L18.73 19 20 17.73 2.27 0 1 1.27zM6.53 6.8l1.55 1.55A2.82 2.82 0 0 0 8 9c0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.4.53-2.2.53-2.76 0-5-2.24-5-5 0-.8.2-1.53.53-2.2zm4.3-.78L14 9.17V9c0-1.66-1.34-3-3-3l-.17.01z"
                  />
                </svg>
              </Button>
            </Box>

            {/* Editor */}
            {lrResized && outputImage && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "calc(100% - 120px)", // Trừ chiều cao header, uploading bar và sidetools
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: `${imageDimensions.width}px`,
                      height: `${imageDimensions.height}px`,
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={lrResized}
                      alt="Before"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                      }}
                      draggable={false}
                    />
                    <img
                      src={outputImage}
                      alt="After"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                      }}
                      draggable={false}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: `${sliderPosition}%`,
                        width: "50px",
                        height: "100%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "ew-resize",
                      }}
                    >
                      <svg
                        width="50px"
                        viewBox="0 0 18 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_2987_6389)">
                          <path d="M2 4L4 2V6L2 4Z" fill="white" />
                        </g>
                        <g filter="url(#filter1_d_2987_6389)">
                          <path d="M16 4L14 6L14 2L16 4Z" fill="white" />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_2987_6389"
                            x="0"
                            y="0"
                            width="6"
                            height="8"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset />
                            <feGaussianBlur stdDeviation="1" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_2987_6389"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_2987_6389"
                              result="shape"
                            />
                          </filter>
                          <filter
                            id="filter1_d_2987_6389"
                            x="12"
                            y="0"
                            width="6"
                            height="8"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset />
                            <feGaussianBlur stdDeviation="1" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_2987_6389"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_2987_6389"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </Box>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "ew-resize",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}
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