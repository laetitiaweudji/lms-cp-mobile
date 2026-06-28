import { Text } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { DangerButton } from "@/components/ui/DangerButton";
import { useAuth } from "@/hooks/auth/useAuth";

export default function TeacherProfile() {
  const { profile, signOut } = useAuth();

  return (
    <ScreenContainer title="Profile" subtitle="Lecturer Profile">
      <Text className="text-text-secondary">Signed in as {profile?.full_name}</Text>
      <DangerButton label="Sign Out" onPress={signOut} />
    </ScreenContainer>
  );
}
