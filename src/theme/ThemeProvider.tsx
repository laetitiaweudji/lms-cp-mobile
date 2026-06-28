import type { ReactNode } from "react";
import { View } from "react-native";
import { vars } from "nativewind";
import { useRoleTheme } from "./useRoleTheme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useRoleTheme();

  const cssVars = vars({
    "--role-sidebar-bg": theme.sidebarBg,
    "--role-sidebar-text": theme.sidebarText,
    "--role-accent": theme.accent,
    "--role-light-bg": theme.lightBg,
    "--role-badge-bg": theme.badgeBg,
    "--role-badge-text": theme.badgeText,
  });

  return <View style={[{ flex: 1 }, cssVars]}>{children}</View>;
}
