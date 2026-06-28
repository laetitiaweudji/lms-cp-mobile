import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type StatCardProps = {
  label: string;
  value: string | number;
  gradient: [string, string];
};

export function StatCard({ label, value, gradient }: StatCardProps) {
  return (
    <View className="flex-1 overflow-hidden rounded-2xl bg-card shadow-sm">
      <LinearGradient colors={gradient} style={{ height: 4 }} />
      <View className="p-4">
        <Text className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </Text>
        <Text className="mt-1 text-2xl font-bold text-text-primary">{value}</Text>
      </View>
    </View>
  );
}
