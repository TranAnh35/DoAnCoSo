import { useState, useEffect } from "react";
import { getImageHistory } from "../services/api";
import { ImageHistoryResponse } from "../types/api";

export const useImageHistory = (userId?: number, session_id?: number) => {
  const [history, setHistory] = useState<ImageHistoryResponse | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string>("");
  
  useEffect(() => {
    getImageHistory(userId, session_id).then(setHistory).catch(console.error);
  }, [userId, session_id]);

  const handleRefreshHistory = () => {
    getImageHistory(userId, session_id).then(setHistory).catch(console.error);
  };

  return {
    history,
    selectedHistory,
    setSelectedHistory,
    handleRefreshHistory,
  };
};