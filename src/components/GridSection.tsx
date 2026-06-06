import type { ReactNode } from "react";

export function GridSection({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-slate-200 py-12 dark:border-slate-800">
      {children}
    </section>
  );
}
