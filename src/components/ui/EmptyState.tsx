import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  message?: string;
};

export function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8 py-12">
      <Icon size={40} color="#94a3b8" />
      <Text className="text-center text-base font-semibold text-text-primary">{title}</Text>
      {message && <Text className="text-center text-sm text-text-muted">{message}</Text>}
    </View>
  );
}
