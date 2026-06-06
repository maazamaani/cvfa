import type { ElementType } from "react";
import {
  BarChart3,
  Bot,
  Briefcase,
  Code2,
  Palette,
  Search,
  Server,
  Target,
  TrendingUp,
} from "lucide-react";
import { skills, type Skill } from "@/data/cv";

const iconMap: Record<string, ElementType> = {
  briefcase: Briefcase,
  palette: Palette,
  "bar-chart-3": BarChart3,
  bot: Bot,
  target: Target,
  "trending-up": TrendingUp,
  search: Search,
  server: Server,
};

const badgeStyles: Record<
  Skill["badge"],
  { badge: string; bar: string; iconBg: string; iconColor: string }
> = {
  حرفه‌ای: {
    badge:
      "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300/90",
    bar: "bg-emerald-600/75 dark:bg-emerald-600/55",
    iconBg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    iconColor: "text-emerald-700 dark:text-emerald-400/90",
  },
  مسلط: {
    badge:
      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-soft",
    bar: "bg-primary/70 dark:bg-primary/50",
    iconBg: "bg-primary/15 dark:bg-primary/20",
    iconColor: "text-primary dark:text-primary-soft",
  },
  میانه: {
    badge:
      "bg-amber-100/70 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300/85",
    bar: "bg-amber-600/60 dark:bg-amber-600/45",
    iconBg: "bg-amber-500/15 dark:bg-amber-500/20",
    iconColor: "text-amber-700 dark:text-amber-400/85",
  },
  آشنا: {
    badge:
      "bg-violet-100/70 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300/85",
    bar: "bg-violet-500/55 dark:bg-violet-500/40",
    iconBg: "bg-violet-500/15 dark:bg-violet-500/20",
    iconColor: "text-violet-700 dark:text-violet-400/85",
  },
};

function SkillCard({ skill }: { skill: Skill }) {
  const styles =
    badgeStyles[skill.badge as keyof typeof badgeStyles] ?? badgeStyles.آشنا;
  const progress = (skill.level / 5) * 100;
  const Icon = iconMap[skill.icon] ?? Code2;

  return (
    <div className="print-avoid-break rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${styles.iconColor}`} strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {skill.name}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}
            >
              {skill.badge}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {skill.nameEn}
          </p>
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-[140px]">
      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">
        تخصص‌ها
      </h2>
      <div className="cv-card-grid grid gap-3 sm:grid-cols-2">
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </section>
  );
}
