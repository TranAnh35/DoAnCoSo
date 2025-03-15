import { useState, useEffect } from "react";
import { getImageHistory } from "../services/api";
import { ImageHistoryResponse } from "../types/api";

export const useImageHistory = (userId?: number) => {
  const [history, setHistory] = useState<ImageHistoryResponse | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string>("");

  useEffect(() => {
    if (userId) {
      getImageHistory(userId).then(setHistory).catch(console.error);
    }
  }, [userId]);

  const handleRefreshHistory = () => {
    if (userId) {
      getImageHistory(userId).then(setHistory).catch(console.error);
    }
  };

  return {
    history,
    selectedHistory,
    setSelectedHistory,
    handleRefreshHistory,
  };
};