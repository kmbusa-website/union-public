"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useLayoutEffect(() => {
    const saved = localStorage.getItem("theme") ?? "light";
    setDark(saved === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border transition"
      style={{
        borderColor: "var(--border-color)",
        color: "var(--text-secondary)",
        background: "var(--bg-card)",
      }}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
