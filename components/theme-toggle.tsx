// components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";

export function ThemeToggle() {
  const dispatch = useAppDispatch();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const toggleDarkMode = () => {
    // Dispatch an action to toggle dark mode
    dispatch(setIsDarkMode(!isDarkMode));
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleDarkMode}
      className="text-white bg-slate-400 p-2 rounded-full ml-auto"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
