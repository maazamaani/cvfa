"use client";

import {
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { navItems } from "@/data/cv";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const iconMap = {
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  heart: Heart,
  sparkles: Sparkles,
  award: Award,
  wrench: Wrench,
} as const;

const sectionIds = navItems.map((item) => item.id);

const navLinkClass = (isActive: boolean) =>
  `relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition ${
    isActive
      ? "text-primary dark:text-primary-soft"
      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
  }`;

export function MobileNav() {
  const activeId = useScrollSpy(sectionIds);

  return (
    <nav
      data-pdf-hide
      className="sticky top-0 z-20 mb-8 flex items-center justify-center border-b border-slate-200 bg-white/90 px-3 py-2.5 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div className="flex items-center gap-0">
        <Link href="#top" title="خانه" className={navLinkClass(activeId === "top")}>
          {activeId === "top" && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary dark:bg-primary-soft" />
          )}
          <Home className="h-6 w-6" strokeWidth={1.5} />
        </Link>

        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Briefcase;
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              title={item.label}
              className={navLinkClass(isActive)}
            >
              {isActive && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary dark:bg-primary-soft" />
              )}
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
