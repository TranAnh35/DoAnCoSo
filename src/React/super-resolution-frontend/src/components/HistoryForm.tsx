// /** @jsxImportSource @emotion/react */
// import React from "react";
// import { css } from "@emotion/react";
// import { Box, Container, Typography, FormControl, InputLabel, Select, Button } from "@mui/material";
// import MenuItem from "@mui/material/MenuItem";
// import ImageUploader from "./ImageUploader";
// import { 
//   mainContainerStyle,
//   previewSectionStyle,
//   previewBoxStyle,
//   } from "../styles/enchancementInterfaceStyles";

// interface HistoryFormProps {
//   history: any;
//   selectedHistory: string;
//   setSelectedHistory: (value: string) => void;
//   handleRefreshHistory: () => void;
// }

// const HistoryForm: React.FC<HistoryFormProps> = ({
//   history,
//   selectedHistory,
//   setSelectedHistory,
//   handleRefreshHistory,
// }) => {
//   return (
//     <Container className="tab2-container">
//       <Box className="history-bar">
//         <FormControl className="history-select">
//           <InputLabel>🕒 Chọn lịch sử</InputLabel>
//           <Select
//             value={selectedHistory || ""}
//             onChange={(e) => setSelectedHistory(e.target.value as string)}
//             label="Chọn lịch sử"
//           >
//             {history && Object.keys(history).length > 0 ? (
//               Object.keys(history).map((key) => (
//                 <MenuItem key={key} value={key}>
//                   {key}
//                 </MenuItem>
//               ))
//             ) : (
//               <MenuItem value="Chưa có lịch sử">Chưa có lịch sử</MenuItem>
//             )}
//           </Select>
//         </FormControl>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleRefreshHistory}
//           className="history-refresh-button"
//         >
//           🔄 Làm mới lịch sử
//         </Button>
//       </Box>
//       {selectedHistory && history && history[selectedHistory] && (
//         <Box className="history-images">
//           <img
//             src={`data:image/png;base64,${history[selectedHistory].input_image}`}
//             alt="Input"
//             style={{ maxWidth: "300px" }}
//           />
//           <img
//             src={`data:image/png;base64,${history[selectedHistory].output_image}`}
//             alt="Output"
//             style={{ maxWidth: "300px" }}
//           />
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default HistoryForm;

/** @jsxImportSource @emotion/react */
import React from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import {
  mainContainerStyle,
  previewSectionStyle,
  previewBoxStyle,
  previewImageStyle,
  controlsSectionStyle,
  controlsContentStyle,
  headerStyle,
  headerTextStyle,
  infoBoxStyle,
  infoTextStyle,
  actionButtonsStyle,
  submitButtonStyle,
  clearButtonStyle,
  iconStyle,
  containerStyle,
  lrImageStyle,
  hrImageStyle,
  sliderStyle,
  dividerContainerStyle,
  dividerStyle,
  leftArrowStyle,
  rightArrowStyle,
  sizeTagLeftStyle,
  sizeTagRightStyle,
  labelLeftStyle,
  labelRightStyle,
} from "../styles/enchancementInterfaceStyles";
import { FormControl, InputLabel, Select, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

interface HistoryFormProps {
  history: any;
  selectedHistory: string;
  setSelectedHistory: (value: string) => void;
  handleRefreshHistory: () => void;
  handleBack: () => void; // Thêm hàm xử lý nút Quay lại
}

const ComparisonSlider: React.FC<{
  lrImage: string;
  hrImage: string;
  lrLabel: string;
  hrLabel: string;
}> = ({ lrImage, hrImage, lrLabel, hrLabel }) => {
  const [sliderPosition, setSliderPosition] = React.useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div css={containerStyle}>
      <img src={lrImage} alt="Low Resolution" css={lrImageStyle} />
      <img src={hrImage} alt="High Resolution" css={hrImageStyle(sliderPosition)} />
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        css={sliderStyle}
      />
      <div css={dividerContainerStyle(sliderPosition)}>
        <div css={dividerStyle} />
        <div css={leftArrowStyle}>
          <ChevronLeft />
        </div>
        <div css={rightArrowStyle}>
          <ChevronRight />
        </div>
      </div>
      <div css={labelLeftStyle}>{lrLabel}</div>
      <div css={labelRightStyle}>{hrLabel}</div>
    </div>
  );
};

const HistoryForm: React.FC<HistoryFormProps> = ({
  history,
  selectedHistory,
  setSelectedHistory,
  handleRefreshHistory,
  handleBack,
}) => {
  return (
    <div css={mainContainerStyle}>
      <div css={previewSectionStyle}>
        <div css={previewBoxStyle}>
          {selectedHistory && history && history[selectedHistory] ? (
            <ComparisonSlider
              lrImage={`data:image/png;base64,${history[selectedHistory].input_image}`}
              hrImage={`data:image/png;base64,${history[selectedHistory].output_image}`}
              lrLabel="Ảnh gốc"
              hrLabel="Ảnh nâng cấp"
            />
          ) : (
            <div>
              <p css={previewImageStyle}>Vui lòng chọn lịch sử để xem ảnh</p>
            </div>
          )}
        </div>
      </div>

      <div css={controlsSectionStyle}>
        <div css={controlsContentStyle}>
          <div css={headerStyle}>
            <h2 css={headerTextStyle}>Lịch sử nâng cấp</h2>
          </div>
          <div css={infoBoxStyle}>
            <p css={infoTextStyle}>
              Chọn thời điểm trong lịch sử để xem kết quả nâng cấp đã thực hiện.
            </p>
          </div>
          <FormControl fullWidth>
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
                <MenuItem value="">Chưa có lịch sử</MenuItem>
              )}
            </Select>
          </FormControl>
          <div css={actionButtonsStyle}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRefreshHistory}
              css={submitButtonStyle}
            >
              <span css={iconStyle}>
                <ZoomIn />
              </span>
              <span>Làm mới</span>
            </Button>
            <button onClick={handleBack} css={clearButtonStyle}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryForm;