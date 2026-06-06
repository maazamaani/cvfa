const DEFAULT_PRIMARY = "#007c6f";
const ACCENT_SOFT_TARGET = "#4eead7";

function isValidHex(color: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(color.trim());
}

function normalizeHex(color: string): string {
  const trimmed = color.trim();
  return trimmed.startsWith("#") ? trimmed.toLowerCase() : `#${trimmed.toLowerCase()}`;
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex).slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mixHex(hex: string, target: "black" | "white", amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = target === "black" ? 0 : 255;
  const factor = amount / 100;
  const nr = clamp(r + (mix - r) * factor);
  const ng = clamp(g + (mix - g) * factor);
  const nb = clamp(b + (mix - b) * factor);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function mixHexColors(from: string, to: string, ratio: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const nr = clamp(a.r + (b.r - a.r) * ratio);
  const ng = clamp(a.g + (b.g - a.g) * ratio);
  const nb = clamp(a.b + (b.b - a.b) * ratio);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function primarySoftAccent(hex: string): string {
  return mixHexColors(hex, ACCENT_SOFT_TARGET, 0.72);
}

export function resolvePrimaryColor(jsonColor?: string | null): string {
  const envColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR?.trim();
  if (envColor && isValidHex(envColor)) {
    return normalizeHex(envColor);
  }
  if (jsonColor && isValidHex(jsonColor)) {
    return normalizeHex(jsonColor);
  }
  return DEFAULT_PRIMARY;
}

export function getPrimaryCssVars(color?: string | null): Record<string, string> {
  const primary = resolvePrimaryColor(color);
  const { r, g, b } = hexToRgb(primary);

  return {
    "--cv-primary": primary,
    "--cv-primary-hover": mixHex(primary, "black", 14),
    "--cv-primary-soft": primarySoftAccent(primary),
    "--cv-primary-muted": `rgb(${r} ${g} ${b} / 0.15)`,
    "--cv-primary-glow": `rgb(${r} ${g} ${b} / 0.22)`,
    "--cv-primary-glow-strong": `rgb(${r} ${g} ${b} / 0.28)`,
  };
}
