import type { ElementType, ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function ResumeTimelineItem({
  icon: Icon,
  period,
  title,
  organization,
  isLast = false,
  url,
  children,
}: {
  icon: ElementType;
  period: string;
  title: string;
  organization: string;
  isLast?: boolean;
  url?: string;
  children?: ReactNode;
}) {
  return (
    <li className={`group relative print-avoid-break ${isLast ? "pb-0" : "pb-10"}`}>
      {!isLast ? (
        <span
          aria-hidden
          className="absolute top-14 bottom-0 start-[1.75rem] w-px bg-slate-200 dark:bg-slate-800"
        />
      ) : null}

      <div className="flex gap-5">
        <div className="relative z-10 flex w-14 shrink-0 justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white transition-all duration-300 group-hover:border-primary-soft group-hover:shadow-[0_0_0_4px_var(--cv-primary-glow),0_0_20px_var(--cv-primary-glow)] dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-primary dark:group-hover:shadow-[0_0_0_4px_var(--cv-primary-glow),0_0_24px_var(--cv-primary-glow-strong)]">
            <Icon
              className="h-6 w-6 text-slate-500 transition-colors duration-300 group-hover:text-primary dark:text-slate-400 dark:group-hover:text-primary-soft"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">{period}</div>
          <h3 className="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100">
            {url ? (
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 transition hover:text-primary dark:hover:text-primary-soft"
              >
                <span>{title}</span>
                <ExternalLink
                  className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-primary dark:text-slate-500 dark:group-hover:text-primary-soft"
                  strokeWidth={1.75}
                />
              </Link>
            ) : (
              title
            )}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {organization}
          </p>
        </div>
      </div>

      {children ? (
        <div className="mt-3 flex gap-5">
          <div aria-hidden className="w-14 shrink-0" />
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {children}
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function ResumeSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[140px]">
      <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <ul>{children}</ul>
    </section>
  );
}
