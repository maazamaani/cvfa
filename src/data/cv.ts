import rawCv from "../../data/cv.json";
import { resolvePrimaryColor } from "@/lib/primaryColor";
import { GITHUB_EDIT_CV_URL } from "@/lib/site";

// --- Types ---

export type Site = {
  title: string;
  description: string;
  githubEditUrl: string | null;
  primaryColor: string;
};

export type Profile = {
  name: string;
  title: string;
  highlight: string;
  hero: {
    titleBefore: string;
    highlight: string;
    summary: string;
  };
  location: string | null;
  birthDate: string | null;
  maritalStatus: string | null;
  footerTitle: string;
};

export type Language = {
  name: string;
  tag: string;
  level: number;
};

export type Contact = {
  href: string;
  icon: string;
  label: string;
  value: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  url?: string;
  items: string[];
};

export type Education = {
  school: string;
  degree: string;
  details?: string[];
};

export type Volunteer = {
  title: string;
  role: string;
  period: string;
  url?: string;
};

export type Skill = {
  name: string;
  nameEn: string;
  level: number;
  badge: string;
  icon: string;
};

export type Certification = {
  org: string;
  detail: string;
};

export type ToolGroup = {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  tools: {
    name: string;
    icon: string;
    description: string;
  }[];
};

export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

// --- Null-safe helpers ---

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  const str = asString(value).trim();
  return str.length > 0 ? str : undefined;
}

function asNullableString(value: unknown): string | null {
  const str = asString(value).trim();
  return str.length > 0 ? str : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asArray<T>(value: unknown, map: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(map).filter((item): item is T => item !== null);
}

// --- Normalizers ---

function normalizeSite(raw: unknown): Site {
  const data = isRecord(raw) ? raw : {};
  const primaryColor = resolvePrimaryColor(asNullableString(data.primaryColor));

  return {
    title: asString(data.title, "رزومه"),
    description: asString(data.description),
    githubEditUrl: GITHUB_EDIT_CV_URL,
    primaryColor,
  };
}

function normalizeProfile(raw: unknown): Profile {
  const data = isRecord(raw) ? raw : {};
  const hero = isRecord(data.hero) ? data.hero : {};
  return {
    name: asString(data.name),
    title: asString(data.title),
    highlight: asString(data.highlight),
    hero: {
      titleBefore: asString(hero.titleBefore),
      highlight: asString(hero.highlight),
      summary: asString(hero.summary),
    },
    location: asNullableString(data.location),
    birthDate: asNullableString(data.birthDate),
    maritalStatus: asNullableString(data.maritalStatus),
    footerTitle: asString(data.footerTitle),
  };
}

function normalizeLanguage(raw: unknown): Language | null {
  if (!isRecord(raw)) return null;
  const name = asString(raw.name).trim();
  if (!name) return null;
  return {
    name,
    tag: asString(raw.tag),
    level: asNumber(raw.level, 1),
  };
}

function normalizeContact(raw: unknown): Contact | null {
  if (!isRecord(raw)) return null;
  const href = asString(raw.href).trim();
  const label = asString(raw.label).trim();
  const value = asString(raw.value).trim();
  if (!href || !label || !value) return null;
  return {
    href,
    icon: asString(raw.icon, "link"),
    label,
    value,
  };
}

function normalizeExperience(raw: unknown): Experience | null {
  if (!isRecord(raw)) return null;
  const company = asString(raw.company).trim();
  if (!company) return null;
  return {
    company,
    role: asString(raw.role),
    period: asString(raw.period),
    url: asOptionalString(raw.url),
    items: asStringArray(raw.items),
  };
}

function normalizeEducation(raw: unknown): Education | null {
  if (!isRecord(raw)) return null;
  const school = asString(raw.school).trim();
  if (!school) return null;
  const details = asStringArray(raw.details);
  return {
    school,
    degree: asString(raw.degree),
    details: details.length > 0 ? details : undefined,
  };
}

function normalizeVolunteer(raw: unknown): Volunteer | null {
  if (!isRecord(raw)) return null;
  const title = asString(raw.title).trim();
  if (!title) return null;
  return {
    title,
    role: asString(raw.role),
    period: asString(raw.period),
    url: asOptionalString(raw.url),
  };
}

function normalizeSkill(raw: unknown): Skill | null {
  if (!isRecord(raw)) return null;
  const name = asString(raw.name).trim();
  if (!name) return null;
  return {
    name,
    nameEn: asString(raw.nameEn),
    level: asNumber(raw.level, 1),
    badge: asString(raw.badge),
    icon: asString(raw.icon, "sparkles"),
  };
}

function normalizeCertification(raw: unknown): Certification | null {
  if (!isRecord(raw)) return null;
  const org = asString(raw.org).trim();
  if (!org) return null;
  return {
    org,
    detail: asString(raw.detail),
  };
}

function normalizeTool(raw: unknown): ToolGroup["tools"][number] | null {
  if (!isRecord(raw)) return null;
  const name = asString(raw.name).trim();
  if (!name) return null;
  return {
    name,
    icon: asString(raw.icon, "wrench"),
    description: asString(raw.description),
  };
}

function normalizeToolGroup(raw: unknown): ToolGroup | null {
  if (!isRecord(raw)) return null;
  const title = asString(raw.title).trim();
  if (!title) return null;
  const tools = asArray(raw.tools, normalizeTool);
  return {
    title,
    description: asString(raw.description),
    icon: asString(raw.icon, "wrench"),
    iconBg: asString(raw.iconBg, "bg-slate-500/15"),
    iconColor: asString(raw.iconColor, "text-slate-500"),
    tools,
  };
}

function normalizeNavItem(raw: unknown): NavItem | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw.id).trim();
  const label = asString(raw.label).trim();
  if (!id || !label) return null;
  return {
    id,
    label,
    icon: asString(raw.icon, "briefcase"),
  };
}

// --- Load & export ---

const cv: Record<string, unknown> = isRecord(rawCv) ? rawCv : {};

export const site = normalizeSite(cv.site);
export const profile = normalizeProfile(cv.profile);
export const languages = asArray(cv.languages, normalizeLanguage);
export const contacts = asArray(cv.contacts, normalizeContact);
export const experiences = asArray(cv.experiences, normalizeExperience);
export const education = asArray(cv.education, normalizeEducation);
export const volunteer = asArray(cv.volunteer, normalizeVolunteer);
export const skills = asArray(cv.skills, normalizeSkill);
export const certifications = asArray(cv.certifications, normalizeCertification);
export const toolGroups = asArray(cv.toolGroups, normalizeToolGroup);
export const navItems = asArray(cv.navItems, normalizeNavItem);
