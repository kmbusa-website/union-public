"use client";

import { useLayoutEffect } from "react";

export function ThemeInit() {
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return null;
}
