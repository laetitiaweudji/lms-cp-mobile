import type { ReactNode } from "react";
import { Text, View } from "react-native";

type DetailSheetProps = {
  title: string;
  children: ReactNode;
};

export function DetailSheet({ title, children }: DetailSheetProps) {
  return (
    <View className="gap-4">
      <Text className="text-lg font-bold text-text-primary">{title}</Text>
      {children}
    </View>
  );
}
