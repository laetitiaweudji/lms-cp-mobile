import { useMemo } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { roleThemes, type RoleTheme } from "./roleThemes";

const fallbackTheme = roleThemes.teacher;

export function useRoleTheme(): RoleTheme {
  const { profile } = useAuth();

  return useMemo(() => {
    const role = profile?.role;
    return role ? roleThemes[role] : fallbackTheme;
  }, [profile?.role]);
}
