import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

type ListRowProps = {
  onPress?: () => void;
  children: ReactNode;
};

export function ListRow({ onPress, children }: ListRowProps) {
  return (
    <Pressable onPress={onPress} className="rounded-2xl bg-card p-4 shadow-sm active:opacity-80">
      <View>{children}</View>
    </Pressable>
  );
}
