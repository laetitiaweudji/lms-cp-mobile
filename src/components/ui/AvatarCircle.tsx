import { Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAvatarGradient } from "@/theme/avatarPalette";

type AvatarCircleProps = {
  name: string;
  avatarUrl?: string | null;
  size?: number;
};

export function AvatarCircle({ name, avatarUrl, size = 40 }: AvatarCircleProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={dimension} />;
  }

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const [from, to] = getAvatarGradient(name);

  return (
    <LinearGradient
      colors={[from, to]}
      style={[dimension, { alignItems: "center", justifyContent: "center" }]}
    >
      <Text style={{ fontSize: size * 0.4 }} className="font-semibold text-text-inverse">
        {initials}
      </Text>
    </LinearGradient>
  );
}
