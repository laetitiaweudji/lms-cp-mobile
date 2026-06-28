import { Text } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

type ScreenPlaceholderProps = {
  title: string;
  subtitle?: string;
};

/** Temporary stand-in for screens built in later phases (4-6). */
export function ScreenPlaceholder({ title, subtitle }: ScreenPlaceholderProps) {
  return (
    <ScreenContainer title={title} subtitle={subtitle}>
      <Text className="text-text-secondary">Coming soon.</Text>
    </ScreenContainer>
  );
}
