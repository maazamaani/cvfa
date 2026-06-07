import type { ElementType } from "react";
import {
  Briefcase,
  Calendar,
  Circle,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { languages, profile, site, type Language, type ProfileDetail } from "@/data/cv";

const profileDetailIcons: Record<string, ElementType> = {
  "map-pin": MapPin,
  calendar: Calendar,
  users: Users,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  heart: Heart,
  home: Home,
  mail: Mail,
  phone: Phone,
  sparkles: Sparkles,
};

function getProfileDetailIcon(icon: string): ElementType {
  return profileDetailIcons[icon] ?? Circle;
}

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
      <div className="flex items-center gap-2 text-sm text-slate-500 lg:text-base dark:text-slate-400">
        <span className="min-w-0 flex-1">{lang.name}</span>
        <span className="shrink-0">{lang.tag}</span>
      </div>
      <div className="h-0.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
        <div
          className="h-full rounded-full bg-primary-soft dark:bg-primary-soft/90"
          style={{ width: `${progress}%` }}
        />
      </div>
    </li>
  );
}

function ProfileDetailRow({
  detail,
  className,
}: {
  detail: ProfileDetail;
  className?: string;
}) {
  const Icon = getProfileDetailIcon(detail.icon);

  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
      <span>{detail.value}</span>
    </span>
  );
}

function PersonalInfoList() {
  if (profile.details.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {profile.details.map((detail, index) => (
        <li
          key={`${detail.icon}-${detail.value}-${index}`}
          className="text-sm text-slate-500 lg:text-base dark:text-slate-400"
        >
          <ProfileDetailRow detail={detail} />
        </li>
      ))}
    </ul>
  );
}

export function MobilePersonalInfoRow() {
  if (profile.details.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 lg:hidden">
      {profile.details.map((detail, index) => (
        <ProfileDetailRow
          key={`${detail.icon}-${detail.value}-${index}`}
          detail={detail}
          className="gap-1.5 text-sm text-slate-500 dark:text-slate-400"
        />
      ))}
    </div>
  );
}

const sectionTitleClass =
  "mb-4 text-sm font-semibold text-slate-800 lg:text-base dark:text-slate-100";

function PersonalInfoSection() {
  if (profile.details.length === 0) {
    return null;
  }

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
    ? "mb-4 text-lg font-semibold text-slate-800 lg:text-xl dark:text-slate-100"
    : sectionTitleClass;

  return (
    <div className={className ? `print-avoid-break ${className}` : "print-avoid-break"}>
      <h3 className={titleClass}>زبان‌ها</h3>
      <LanguageLevelsList />
    </div>
  );
}

function GitHubRepoButton() {
  if (!site.githubRepoUrl) return null;

  return (
    <a
      href={site.githubRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-pdf-hide
      className="mt-6 flex w-full items-center gap-2 text-sm text-slate-500 transition hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
    >
      <GitHubIcon className="h-4 w-4 shrink-0" />
      <span>در گیت‌هاب ببینید</span>
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
      <LanguagesSection className={profile.details.length > 0 ? "mt-8" : undefined} />
      <GitHubRepoButton />
    </div>
  );
}
