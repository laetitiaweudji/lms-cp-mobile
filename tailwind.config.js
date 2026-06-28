// Color/radius/fontSize values are duplicated from src/theme/tokens.ts intentionally:
// tailwind.config.js is loaded by plain Node (no TS loader), so it can't `require()`
// a .ts file. src/theme/tokens.ts remains the source of truth for use inside
// components (StyleSheet objects, gradients, etc.); keep the two in sync if either changes.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
        success: "#10b981",
        "success-light": "#d1fae5",
        warning: "#f59e0b",
        "warning-light": "#fef3c7",
        danger: "#ef4444",
        "danger-light": "#fee2e2",
        info: "#3b82f6",
        "info-light": "#dbeafe",
        page: "#f1f5f9",
        card: "#ffffff",
        input: "#f8fafc",
        "text-primary": "#0f172a",
        "text-secondary": "#475569",
        "text-muted": "#94a3b8",
        "text-inverse": "#ffffff",
        // Per-role dynamic values, set at runtime by ThemeProvider via nativewind's vars()
        "role-bg": "var(--role-sidebar-bg)",
        "role-bg-text": "var(--role-sidebar-text)",
        "role-accent": "var(--role-accent)",
        "role-light": "var(--role-light-bg)",
        "role-badge-bg": "var(--role-badge-bg)",
        "role-badge-text": "var(--role-badge-text)",
      },
      borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
      },
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "5xl": 48,
        "6xl": 60,
      },
      fontFamily: {
        sans: ["Geist_400Regular"],
        mono: ["GeistMono_400Regular"],
        serif: ["PlayfairDisplay_400Regular"],
        body: ["DMSans_400Regular"],
      },
    },
  },
  plugins: [],
};
