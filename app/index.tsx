import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-page">
      <Text className="font-sans text-3xl font-bold text-text-primary">
        SCP Portal
      </Text>
      <Text className="mt-2 text-base text-text-secondary">
        Phase 0 scaffold is alive.
      </Text>
    </View>
  );
}
