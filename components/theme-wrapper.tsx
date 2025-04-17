"use client";

import { useAppSelector } from "@/app/redux"; // Pastikan export hook di redux.ts
import { useEffect } from "react";

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <div className={`${isDarkMode ? "dark" : "light"} `}>{children}</div>;
};
