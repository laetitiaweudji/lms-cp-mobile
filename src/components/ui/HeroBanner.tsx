import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoleTheme } from "@/theme/useRoleTheme";

type HeroBannerProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function HeroBanner({ eyebrow, title, description }: HeroBannerProps) {
  const theme = useRoleTheme();

  return (
    <LinearGradient
      colors={[theme.hero.from, theme.hero.via, theme.hero.to]}
      className="rounded-3xl p-6"
    >
      <Text className="text-xs font-semibold uppercase tracking-widest text-white/80">
        {eyebrow}
      </Text>
      <Text className="mt-1 text-2xl font-bold text-text-inverse">{title}</Text>
      {description && <Text className="mt-2 text-sm text-white/90">{description}</Text>}
    </LinearGradient>
  );
}
