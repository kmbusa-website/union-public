"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readStoredTheme } from "@/lib/theme";

if (typeof window !== "undefined") {
  applyTheme(readStoredTheme());
}

export function ThemeInit() {
  useLayoutEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  return null;
}
