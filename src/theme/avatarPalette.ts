import { avatarGradientPalette } from "./tokens";

export function getAvatarGradient(name: string): [string, string] {
  const code = name.charCodeAt(0) || 0;
  return avatarGradientPalette[code % avatarGradientPalette.length];
}
