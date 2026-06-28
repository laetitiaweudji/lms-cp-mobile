export const colors = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  semantic: {
    success: "#10b981",
    successLight: "#d1fae5",
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    danger: "#ef4444",
    dangerLight: "#fee2e2",
    info: "#3b82f6",
    infoLight: "#dbeafe",
  },
  background: {
    page: "#f1f5f9",
    card: "#ffffff",
    overlay: "rgba(0,0,0,0.5)",
    input: "#f8fafc",
  },
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#94a3b8",
    inverse: "#ffffff",
  },
} as const;

/**
 * Reused anywhere a role chip labels authorship of shared content
 * (e.g. "who posted this announcement") — distinct from each role's
 * own theme.badge, which colors that role's chrome when viewing
 * their own app.
 */
export const roleBadgeColors = {
  teacher: { bg: "#f5f3ff", text: "#6d28d9" },
  student: { bg: "#f0fdfa", text: "#0f766e" },
  parent: { bg: "#fffbeb", text: "#b45309" },
} as const;

export const avatarGradientPalette: [string, string][] = [
  ["#7c3aed", "#4f46e5"],
  ["#0891b2", "#0d9488"],
  ["#f43f5e", "#db2777"],
  ["#f59e0b", "#ea580c"],
  ["#10b981", "#0891b2"],
];

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "5xl": 48,
  "6xl": 60,
} as const;

export const fontWeight = {
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
} as const;

export const letterSpacing = {
  wide: 0.025 * fontSize.base,
  wider: 0.05 * fontSize.base,
  widest: 0.1 * fontSize.base,
} as const;

export const layout = {
  headerHeight: 60,
  tabBarHeight: 64,
} as const;
