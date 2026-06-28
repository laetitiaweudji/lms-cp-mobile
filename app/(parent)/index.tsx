import { Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/hooks/auth/useAuth";

export default function ParentPlaceholder() {
  const { profile, signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-page px-6">
      <Text className="text-xl font-bold text-text-primary">Parent area</Text>
      <Text className="text-text-secondary">Signed in as {profile?.full_name}</Text>
      <PrimaryButton label="Sign Out" onPress={signOut} className="w-full" />
    </View>
  );
}
