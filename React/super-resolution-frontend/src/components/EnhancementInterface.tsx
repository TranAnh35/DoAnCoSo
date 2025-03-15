import React from "react";
import { Box, Typography, FormControl, InputLabel, Select, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "../styles/ImageProcess.css";

interface EnhancementInterfaceProps {
  inputPreview: string;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: () => void;
  handleClear: () => void;
}

const EnhancementInterface: React.FC<EnhancementInterfaceProps> = ({
  inputPreview,
  scale,
  setScale,
  handleSubmit,
  handleClear,
}) => {
  return (
    <Box className="enhancement-container">
      <Box className="preview-container">
        <img src={inputPreview} alt="Preview" className="preview-image" />
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
            <MenuItem value={2}>2x</MenuItem>
            <MenuItem value={3}>3x</MenuItem>
            <MenuItem value={4}>4x</MenuItem>
          </Select>
        </FormControl>
        <Box className="options-buttons">
          <Button variant="outlined" onClick={handleClear} className="back-button">
            Quay lại
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} className="submit-button">
            Nâng cấp
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EnhancementInterface;