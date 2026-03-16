const STORAGE_KEY = "theme";

export function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "winter" || saved === "night") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "night" : "winter";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

