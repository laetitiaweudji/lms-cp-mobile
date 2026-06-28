import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";

export default function Index() {
  const { status, profile } = useAuth();

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-page">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (status !== "authenticated" || !profile) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (profile.role) {
    case "teacher":
      return <Redirect href="/(teacher)" />;
    case "student":
      return <Redirect href="/(student)" />;
    case "parent":
      return <Redirect href="/(parent)" />;
  }
}
