import React from "react";
import { Box, Button, Typography } from "@mui/material";
import "../styles/ImageProcess.css";

interface ImageUploaderProps {
  label: string;
  id: string;
  onImageChange: (file: File, preview: string) => void;
  onReset: () => void;
  preview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, id, onImageChange, onReset, preview }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(file, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className="quality-upload-item">
      <Typography variant="h5" gutterBottom>
        {label}
      </Typography>
      {!preview ? (
        <>
          <input type="file" id={id} style={{ display: "none" }} onChange={handleChange} />
          <label htmlFor={id}>
            <Button variant="contained" component="span" className="upload-button">
              Chọn {label}
            </Button>
          </label>
        </>
      ) : (
        <>
          <img src={preview} alt={label} className="quality-image" />
          <Button variant="outlined" onClick={onReset} className="reset-button">
            Quay lại
          </Button>
        </>
      )}
    </Box>
  );
};

export default ImageUploader;