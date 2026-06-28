import { Pressable, Text, View } from "react-native";
import { Bell } from "lucide-react-native";
import { router, type Href } from "expo-router";
import { AvatarCircle } from "@/components/ui/AvatarCircle";
import { useAuth } from "@/hooks/auth/useAuth";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

function profileRouteForRole(role: string | undefined): Href {
  switch (role) {
    case "teacher":
      return "/(teacher)/profile";
    case "parent":
      return "/(parent)/profile";
    case "student":
      return "/(student)/more/settings";
    default:
      return "/";
  }
}

export function Header({ title, subtitle }: HeaderProps) {
  const { profile } = useAuth();
  const showBellDot = profile?.role === "teacher";

  return (
    <View className="h-16 flex-row items-center justify-between border-b border-neutral-200 bg-card px-4">
      <View>
        <Text className="text-lg font-bold text-text-primary">{title}</Text>
        {subtitle && <Text className="text-sm text-text-secondary">{subtitle}</Text>}
      </View>
      <View className="flex-row items-center gap-4">
        <View>
          <Bell size={22} color="#475569" />
          {showBellDot && (
            <View className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
          )}
        </View>
        <Pressable onPress={() => router.push(profileRouteForRole(profile?.role))}>
          <AvatarCircle name={profile?.full_name ?? "?"} avatarUrl={profile?.avatar_url} size={32} />
        </Pressable>
      </View>
    </View>
  );
}
