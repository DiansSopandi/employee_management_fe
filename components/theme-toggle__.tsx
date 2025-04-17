"use client";

import { useTheme } from "./theme-provider__";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 bg-slate-400" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
