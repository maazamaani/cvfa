import { Calendar, MapPin, Users } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { languages, profile, site, type Language } from "@/data/cv";

const personalInfo = (
  [
    profile.location ? { icon: MapPin, value: profile.location } : null,
    profile.birthDate ? { icon: Calendar, value: profile.birthDate } : null,
    profile.maritalStatus ? { icon: Users, value: profile.maritalStatus } : null,
  ] as const
).filter((item): item is { icon: typeof MapPin; value: string } => item !== null);

function LanguageLevelsList() {
  return (
    <ul className="space-y-3">
      {languages.map((lang) => (
        <LanguageRow key={lang.name} lang={lang} />
      ))}
    </ul>
  );
}

function LanguageRow({ lang }: { lang: Language }) {
  const progress = (lang.level / 5) * 100;

  return (
    <li className="print-avoid-break space-y-1.5">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="min-w-0 flex-1">{lang.name}</span>
        <span className="shrink-0">{lang.tag}</span>
      </div>
      <div className="h-0.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
        <div
          className="h-full rounded-full bg-slate-400/70 dark:bg-slate-500/55"
          style={{ width: `${progress}%` }}
        />
      </div>
    </li>
  );
}

function PersonalInfoList() {
  return (
    <ul className="space-y-2">
      {personalInfo.map(({ icon: Icon, value }) => (
        <li
          key={value}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          {value}
        </li>
      ))}
    </ul>
  );
}

export function MobilePersonalInfoRow() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 lg:hidden">
      {personalInfo.map(({ icon: Icon, value }) => (
        <div
          key={value}
          className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

const sectionTitleClass =
  "mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100";

function PersonalInfoSection() {
  return (
    <div className="print-avoid-break">
      <h3 className={sectionTitleClass}>اطلاعات شخصی</h3>
      <PersonalInfoList />
    </div>
  );
}

function LanguagesSection({
  className,
  largeTitle = false,
}: {
  className?: string;
  largeTitle?: boolean;
}) {
  const titleClass = largeTitle
    ? "mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100"
    : sectionTitleClass;

  return (
    <div className={className ? `print-avoid-break ${className}` : "print-avoid-break"}>
      <h3 className={titleClass}>زبان‌ها</h3>
      <LanguageLevelsList />
    </div>
  );
}

function EditPageButton() {
  if (!site.githubEditUrl) return null;

  return (
    <a
      href={site.githubEditUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-pdf-hide
      className="mt-6 flex w-full items-center gap-2 text-sm text-slate-500 transition hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
    >
      <GitHubIcon className="h-4 w-4 shrink-0" />
      <span>ویرایش این صفحه</span>
    </a>
  );
}

export function ProfileWidgets({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  if (variant === "mobile") {
    return <LanguagesSection largeTitle />;
  }

  return (
    <div className="w-full">
      <PersonalInfoSection />
      <LanguagesSection className="mt-8" />
      <EditPageButton />
    </div>
  );
}
