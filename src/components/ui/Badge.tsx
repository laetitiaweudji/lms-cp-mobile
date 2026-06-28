import { Text, View } from "react-native";
import { roleBadgeColors } from "@/theme/tokens";

type BadgeProps = {
  label: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

export function Badge({ label, bgColor = "#f1f5f9", textColor = "#475569", className }: BadgeProps) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${className ?? ""}`} style={{ backgroundColor: bgColor }}>
      <Text className="text-xs font-medium" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}

type RoleBadgeProps = {
  role: "teacher" | "student" | "parent";
};

/** Labels authorship of shared content (e.g. "who posted this announcement"). */
export function RoleBadge({ role }: RoleBadgeProps) {
  const colors = roleBadgeColors[role];
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  return <Badge label={label} bgColor={colors.bg} textColor={colors.text} />;
}
