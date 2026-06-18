export const THEME_STORAGE_KEY = "kmbusa-theme";
export const DEFAULT_THEME = "dark" as const;

export type ThemeMode = "dark" | "light";

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" ? "light" : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme !== "light");
  document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
}

export function storeTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"${DEFAULT_THEME}";var d=t!=="light";document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;
