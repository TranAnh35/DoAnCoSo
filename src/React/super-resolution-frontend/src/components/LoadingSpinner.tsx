// components/LoadingSpiner.tsx

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  height: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
      }}
    >
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Đang xử lý ảnh...</Typography>
    </Box>
  );
};

export default LoadingSpinner;