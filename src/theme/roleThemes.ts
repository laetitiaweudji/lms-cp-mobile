export type AppRole = "teacher" | "student" | "parent";

export type RoleTheme = {
  sidebarBg: string;
  sidebarText: string;
  hero: { from: string; via: string; to: string };
  badgeBg: string;
  badgeText: string;
  accent: string;
  lightBg: string;
};

export const roleThemes: Record<AppRole, RoleTheme> = {
  teacher: {
    sidebarBg: "#0f172a",
    sidebarText: "#e2e8f0",
    hero: { from: "#4f46e5", via: "#9333ea", to: "#c026d3" },
    badgeBg: "#f5f3ff",
    badgeText: "#6d28d9",
    accent: "#4f46e5",
    lightBg: "#eef2ff",
  },
  student: {
    sidebarBg: "#020617",
    sidebarText: "#cbd5e1",
    hero: { from: "#1d4ed8", via: "#1d4ed8", to: "#7e22ce" },
    badgeBg: "#eff6ff",
    badgeText: "#1d4ed8",
    accent: "#2563eb",
    lightBg: "#eff6ff",
  },
  parent: {
    sidebarBg: "#020617",
    sidebarText: "#cbd5e1",
    hero: { from: "#2563eb", via: "#4f46e5", to: "#9333ea" },
    badgeBg: "#eff6ff",
    badgeText: "#1d4ed8",
    accent: "#2563eb",
    lightBg: "#eff6ff",
  },
};
