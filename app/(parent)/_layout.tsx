import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";

export default function ParentLayout() {
  const { status, profile } = useAuth();

  if (status !== "authenticated" || !profile) {
    return <Redirect href="/(auth)/login" />;
  }
  if (profile.role !== "parent") {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
