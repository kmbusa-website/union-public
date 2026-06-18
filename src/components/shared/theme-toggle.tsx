"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { applyTheme, readStoredTheme, storeTheme, type ThemeMode } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useLayoutEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function toggle() {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    storeTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="header-icon-btn"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
