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
import { ThemeToggle } from "@/components/ThemeToggle";
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

export function Sidebar() {
  const activeId = useScrollSpy(sectionIds);

  return (
    <aside
      data-pdf-hide
      className="hidden w-24 shrink-0 self-stretch border-e border-slate-200 dark:border-slate-800 lg:block"
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex w-full flex-col gap-1">
            <Link
              href="#top"
              title="خانه"
              className={`relative flex h-11 w-full items-center justify-center rounded-lg transition ${
                activeId === "top"
                  ? "text-primary dark:text-primary-soft"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
            >
              {activeId === "top" && (
                <span className="absolute end-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary dark:bg-primary-soft" />
              )}
              <Home className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            {navItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Briefcase;
              const isActive = activeId === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  title={item.label}
                  className={`relative flex h-11 w-full items-center justify-center rounded-lg transition ${
                    isActive
                      ? "text-primary dark:text-primary-soft"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  }`}
                >
                  {isActive && (
                    <span className="absolute end-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary dark:bg-primary-soft" />
                  )}
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex justify-center pb-6">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
