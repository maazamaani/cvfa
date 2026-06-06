"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const sizeStyles = {
  default: { button: "h-10 w-10", icon: "h-4 w-4" },
  large: { button: "h-12 w-12", icon: "h-6 w-6" },
} as const;

export function ThemeToggle({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: keyof typeof sizeStyles;
}) {
  const { theme, toggleTheme } = useTheme();
  const styles = sizeStyles[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک"}
      className={`flex items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200 ${styles.button} ${className}`}
    >
      {theme === "dark" ? (
        <Sun className={styles.icon} strokeWidth={1.5} />
      ) : (
        <Moon className={styles.icon} strokeWidth={1.5} />
      )}
    </button>
  );
}
