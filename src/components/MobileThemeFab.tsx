"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileThemeFab() {
  return (
    <div data-pdf-hide className="fixed bottom-4 left-4 z-40 lg:hidden">
      <ThemeToggle
        size="large"
        className="bg-white shadow-lg shadow-slate-900/10 dark:bg-slate-900 dark:shadow-black/30"
      />
    </div>
  );
}
