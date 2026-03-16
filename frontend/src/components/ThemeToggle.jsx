import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "night";
  return (
    <button
      type="button"
      className="btn btn-ghost btn-square"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "winter" : "night")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

