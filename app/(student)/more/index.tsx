import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import { FileText, Mic2, Award, Settings } from "lucide-react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const LINKS = [
  { label: "Materials", href: "/(student)/more/materials" as const, icon: FileText },
  { label: "Recordings", href: "/(student)/more/recordings" as const, icon: Mic2 },
  { label: "Results", href: "/(student)/more/results" as const, icon: Award },
  { label: "Settings", href: "/(student)/more/settings" as const, icon: Settings },
];

export default function StudentMoreMenu() {
  return (
    <ScreenContainer title="More">
      {LINKS.map(({ label, href, icon: Icon }) => (
        <Pressable
          key={href}
          onPress={() => router.push(href)}
          className="flex-row items-center gap-3 rounded-2xl bg-card p-4 shadow-sm active:opacity-80"
        >
          <Icon size={20} color="#475569" />
          <Text className="text-base font-medium text-text-primary">{label}</Text>
        </Pressable>
      ))}
    </ScreenContainer>
  );
}
