import React, { useState, useEffect, useRef } from "react";
import "../styles/ImageProcess.css";
import {
  processImage,
  getImageHistory,
  evaluateQuality,
  saveImageHistory,
} from "../services/api";
import {
  ImageHistoryResponse,
  ProcessImageResponse,
  QualityEvaluationResponse,
  ImageHistoryRequest,
} from "../types/api";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Box,
  Container,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// ====================== Header Component ======================
const Header: React.FC<{ tab: number; setTab: (value: number) => void }> = ({
  tab,
  setTab,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" className="header-appbar">
      <Toolbar className="header-toolbar">
        <div className="header-left">
          <img src="/logopnk.png" alt="Logo" className="logo-img" />
          <Typography variant="h6" className="header-title">
            Super Resolution
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            className="header-tabs"
          >
            <Tab label="✨ Nâng cấp ảnh" />
            <Tab label="📊 Đánh giá chất lượng" />
            <Tab label="📜 Lịch sử" />
          </Tabs>
        </div>
        <div className="header-right">
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            className="header-menu-btn"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Cài đặt</MenuItem>
            <MenuItem onClick={handleMenuClose}>Đăng nhập</MenuItem>
            <MenuItem onClick={handleMenuClose}>Đăng ký</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

// ====================== UploadComponent ======================
const UploadComponent: React.FC<{
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ handleFileChange }) => {
  return (
    <Box className="upload-container">
      <Typography variant="h5" gutterBottom>
        Tải ảnh lên để nâng cấp
      </Typography>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label htmlFor="fileInput">
        <Button variant="contained" component="span" className="upload-button">
          Chọn ảnh
        </Button>
      </label>
    </Box>
  );
};

// ====================== EnhancementInterface ======================
const EnhancementInterface: React.FC<{
  inputPreview: string;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: () => void;
  handleClear: () => void;
}> = ({ inputPreview, scale, setScale, handleSubmit, handleClear }) => {
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageWidth(naturalWidth);
    setImageHeight(naturalHeight);
  };

  return (
    <Box className="enhancement-container">
      <Box className="preview-container">
        <img
          src={inputPreview}
          alt="Preview"
          className="preview-image"
          onLoad={handleImageLoad}
        />
        {imageWidth && imageHeight && (
          <>
            <Box className="dimension-label-left">
              {imageWidth} x {imageHeight} px
            </Box>
            <Box className="dimension-label-right">
              {imageWidth * scale} x {imageHeight * scale} px
            </Box>
          </>
        )}
      </Box>
      <Box className="options-container">
        <Typography variant="h6" gutterBottom>
          Tùy chọn nâng cấp
        </Typography>
        <FormControl fullWidth className="form-control">
          <InputLabel id="scale-select-label">Chọn kích thước</InputLabel>
          <Select
            labelId="scale-select-label"
            value={scale}
            label="Chọn kích thước"
            onChange={(e) => setScale(Number(e.target.value))}
          >
            <SelectMenuItem value={2}>2x</SelectMenuItem>
            <SelectMenuItem value={3}>3x</SelectMenuItem>
            <SelectMenuItem value={4}>4x</SelectMenuItem>
          </Select>
        </FormControl>
        <Box className="options-buttons">
          <Button
            variant="outlined"
            onClick={handleClear}
            className="back-button"
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="submit-button"
          >
            Nâng cấp
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ====================== QualityEvaluation Component ======================
const QualityEvaluation: React.FC = () => {
  const [srImage, setSrImage] = useState<File | null>(null);
  const [hrImage, setHrImage] = useState<File | null>(null);
  const [srPreview, setSrPreview] = useState<string | null>(null);
  const [hrPreview, setHrPreview] = useState<string | null>(null);
  const [psnr, setPsnr] = useState<number | null>(null);
  const [ssim, setSsim] = useState<number | null>(null);

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
    if (!srImage || !hrImage) {
      alert("Vui lòng chọn cả ảnh SR và ảnh HR để đánh giá!");
      return;
    }
    try {
      const response: QualityEvaluationResponse = await evaluateQuality(
        srImage,
        hrImage
      );
      setPsnr(response.psnr);
      setSsim(response.ssim);
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      alert("Có lỗi xảy ra khi đánh giá chất lượng ảnh!");
    }
  };

  const handleResetSrImage = () => {
    setSrImage(null);
    setSrPreview(null);
  };

  const handleResetHrImage = () => {
    setHrImage(null);
    setHrPreview(null);
  };

  return (
    <Box>
      <Box className="quality-upload-container">
        <Box className="quality-upload-item">
          <Typography variant="subtitle1">Ảnh SR</Typography>
          {!srPreview ? (
            <>
              <input
                type="file"
                id="srImage"
                style={{ display: "none" }}
                onChange={handleSrImageChange}
              />
              <label htmlFor="srImage">
                <Button
                  variant="contained"
                  component="span"
                  className="upload-button"
                >
                  Thêm ảnh SR
                </Button>
              </label>
            </>
          ) : (
            <>
              <img src={srPreview} alt="Ảnh SR" className="quality-image" />
              <Button
                variant="outlined"
                onClick={handleResetSrImage}
                className="reset-button"
              >
                Quay lại
              </Button>
            </>
          )}
        </Box>
        <Box className="quality-upload-item">
          <Typography variant="subtitle1">Ảnh HR</Typography>
          {!hrPreview ? (
            <>
              <input
                type="file"
                id="hrImage"
                style={{ display: "none" }}
                onChange={handleHrImageChange}
              />
              <label htmlFor="hrImage">
                <Button
                  variant="contained"
                  component="span"
                  className="upload-button"
                >
                  Thêm ảnh HR
                </Button>
              </label>
            </>
          ) : (
            <>
              <img src={hrPreview} alt="Ảnh HR" className="quality-image" />
              <Button
                variant="outlined"
                onClick={handleResetHrImage}
                className="reset-button"
              >
                Quay lại
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Box className="metrics-container">
        <Box className="metric-box">
          <Typography variant="subtitle2">PSNR</Typography>
          <Typography variant="body1">{psnr !== null ? psnr : "-"}</Typography>
        </Box>
        <Box className="metric-box">
          <Typography variant="subtitle2">SSIM</Typography>
          <Typography variant="body1">{ssim !== null ? ssim : "-"}</Typography>
        </Box>
      </Box>
      <Box className="calculate-container">
        <Button
          variant="contained"
          onClick={handleEvaluate}
          className="calculate-button"
        >
          Tính toán
        </Button>
      </Box>
    </Box>
  );
};

// ====================== Main Component ======================
const ImageProcess: React.FC = () => {
  // Các state của tab Super Resolution
  const [tab, setTab] = useState(0);
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [lrResized, setLrResized] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [history, setHistory] = useState<ImageHistoryResponse | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string>("");

  // Lấy userId từ localStorage (nếu có)
  const userId = localStorage.getItem("user_id")
    ? parseInt(localStorage.getItem("user_id")!)
    : undefined;

  // Các state cho chức năng zoom/pan ảnh đầu ra
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 600,
    height: 400,
  });
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bắt sự kiện Ctrl để bật chế độ kéo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control") setIsCtrlPressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Xử lý sự kiện wheel để zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => Math.min(3, Math.max(1, prev + delta)));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [outputImage]);

  // Lấy kích thước ảnh đầu ra sau khi load
  useEffect(() => {
    if (outputImage) {
      const img = new Image();
      img.src = outputImage;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    }
  }, [outputImage]);

  // Xử lý tải file ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setInputPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Xử lý submit ảnh để nâng cấp
  const handleSubmit = async () => {
    if (!inputImage) {
      alert("Vui lòng chọn một ảnh để xử lý!");
      return;
    }
    try {
      const response: ProcessImageResponse = await processImage(
        inputImage,
        scale
      );
      const lrResizedBase64 = `data:image/png;base64,${response.lr_resized}`;
      const outputBase64 = `data:image/png;base64,${response.output}`;
      setLrResized(lrResizedBase64);
      setOutputImage(outputBase64);

      // Lưu lịch sử nếu có userId
      if (userId && inputPreview) {
        const historyRequest: ImageHistoryRequest = {
          user_id: userId,
          input_image: inputPreview.split(",")[1],
          output_image: response.output,
          scale: scale,
        };
        await saveImageHistory(historyRequest);
      }
      if (userId) {
        const historyData = await getImageHistory(userId);
        setHistory(historyData);
      }
    } catch (error: any) {
      console.error("Lỗi khi xử lý ảnh:", error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra khi xử lý ảnh!");
    }
  };

  const handleClear = () => {
    setInputImage(null);
    setInputPreview(null);
    setOutputImage(null);
    setLrResized(null);
  };

  // Các hàm xử lý kéo (drag) ảnh khi giữ Ctrl
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCtrlPressed) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
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
    e.preventDefault();
  };

  // Hàm tải xuống ảnh đầu ra
  const handleDownload = () => {
    if (!outputImage) return;
    const link = document.createElement("a");
    link.href = outputImage;
    link.download = `super_resolution_${scale}x.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lấy lịch sử khi chuyển sang tab Lịch sử
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
    <Box>
      <Header tab={tab} setTab={setTab} />
      <Toolbar /> {/* Đẩy nội dung xuống dưới AppBar */}
      {/* Tab 0: Nâng cấp ảnh */}
      {tab === 0 && (
        <>
          {!inputPreview ? (
            <UploadComponent handleFileChange={handleFileChange} />
          ) : (
            <EnhancementInterface
              inputPreview={inputPreview}
              scale={scale}
              setScale={setScale}
              handleSubmit={handleSubmit}
              handleClear={handleClear}
            />
          )}
          {lrResized && (
            <Container className="lr-container">
              <Typography variant="h5" gutterBottom>
                Ảnh LR Resized
              </Typography>
              <img src={lrResized} alt="LR Resized" className="lr-image" />
            </Container>
          )}
          {outputImage && (
            <Container className="output-container">
              <Typography variant="h5" gutterBottom>
                Ảnh đã nâng cấp
              </Typography>
              <Box
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDragStart={handleDragStart}
                style={{
                  overflow: "hidden",
                  width: "768px",
                  height: "768px",
                  border: "1px solid #ccc",
                  position: "relative",
                }}
              >
                <img
                  src={outputImage}
                  alt="Output"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease",
                    userSelect: "none",
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleDownload}
                style={{ marginTop: "10px" }}
              >
                Tải xuống
              </Button>
            </Container>
          )}
        </>
      )}
      {/* Tab 1: Đánh giá chất lượng */}
      {tab === 1 && (
        <Container className="tab1-container">
          <Typography variant="h5" gutterBottom>
            Đánh giá chất lượng ảnh
          </Typography>
          <QualityEvaluation />
        </Container>
      )}
      {/* Tab 2: Lịch sử ảnh */}
      {tab === 2 && (
        <Container className="tab2-container">
          <Typography variant="h5" gutterBottom>
            Lịch sử ảnh
          </Typography>
          <Box className="history-bar">
            <FormControl className="history-select">
              <InputLabel>🕒 Chọn lịch sử</InputLabel>
              <Select
                value={selectedHistory || ""}
                onChange={(e) => setSelectedHistory(e.target.value as string)}
                label="Chọn lịch sử"
              >
                {history && Object.keys(history).length > 0 ? (
                  Object.keys(history).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="Chưa có lịch sử">Chưa có lịch sử</MenuItem>
                )}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefreshHistory}
              className="history-refresh-button"
            >
              🔄 Làm mới lịch sử
            </Button>
          </Box>
          {selectedHistory && history && history[selectedHistory] && (
            <Box className="history-images">
              <img
                src={`data:image/png;base64,${history[selectedHistory].input_image}`}
                alt="Input"
                style={{ maxWidth: "300px" }}
              />
              <img
                src={`data:image/png;base64,${history[selectedHistory].output_image}`}
                alt="Output"
                style={{ maxWidth: "300px" }}
              />
            </Box>
          )}
        </Container>
      )}
    </Box>
  );
};

export default ImageProcess;
