import type { ColorValue } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type TabBarIconProps = {
  icon: LucideIcon;
  color: ColorValue;
  size?: number;
};

export function TabBarIcon({ icon: Icon, color, size = 22 }: TabBarIconProps) {
  return <Icon color={color as string} size={size} />;
}
