import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";

type ScreenContainerProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenContainer({ title, subtitle, children, scroll = true }: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title={title} subtitle={subtitle} />
      {scroll ? (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 gap-4 p-4">{children}</View>
      )}
    </SafeAreaView>
  );
}
