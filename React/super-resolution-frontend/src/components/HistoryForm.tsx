import React from "react";
import { Box, Container, Typography, FormControl, InputLabel, Select, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "../styles/ImageProcess.css";

interface HistoryFormProps {
  history: any;
  selectedHistory: string;
  setSelectedHistory: (value: string) => void;
  handleRefreshHistory: () => void;
}

const HistoryForm: React.FC<HistoryFormProps> = ({
  history,
  selectedHistory,
  setSelectedHistory,
  handleRefreshHistory,
}) => {
  return (
    <Container className="tab2-container">
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
  );
};

export default HistoryForm;