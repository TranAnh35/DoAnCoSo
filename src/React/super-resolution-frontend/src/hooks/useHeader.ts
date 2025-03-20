// hooks/useHeader.ts

import { useState } from "react";

export const useHeader = (navigate: (path: string) => void) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 1) navigate("/evaluate");
    else if (newTab === 2) navigate("/history");
  };

  return {
    tab,
    setTab,
    handleTabChange,
  };
};