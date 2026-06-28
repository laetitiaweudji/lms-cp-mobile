import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { AvatarCircle } from "@/components/ui/AvatarCircle";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DangerButton } from "@/components/ui/DangerButton";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";
import { useAuth } from "@/hooks/auth/useAuth";
import { useChangePassword } from "@/hooks/shared/useChangePassword";

export default function StudentSettings() {
  const { profile, signOut } = useAuth();
  const sheet = useAppBottomSheet();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = () => {
    setError(null);
    setSuccess(false);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setCurrentPassword("");
          setNewPassword("");
        },
        onError: (err) => setError(err.message),
      }
    );
  };

  const confirmLogout = () => {
    sheet.open(
      <ConfirmSheet
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        confirmLabel="Yes, Logout"
        destructive
        onCancel={sheet.close}
        onConfirm={() => {
          sheet.close();
          signOut();
        }}
      />,
      { mode: "center" }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-page" edges={["top"]}>
      <Header title="Settings" />
      <View className="flex-1 gap-4 p-4">
        <HeroBanner eyebrow="Settings" title="Manage your account." />

        <View className="flex-row items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
          <AvatarCircle name={profile?.full_name ?? "?"} avatarUrl={profile?.avatar_url} size={56} />
          <View>
            <Text className="text-base font-semibold text-text-primary">{profile?.full_name}</Text>
            <Text className="text-sm text-text-secondary">{profile?.email}</Text>
            <Text className="text-xs text-text-muted">Student</Text>
          </View>
        </View>

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Change Password</Text>

          {error && <Text className="text-sm font-medium text-danger">{error}</Text>}
          {success && (
            <Text className="text-sm font-medium text-success">Password updated successfully.</Text>
          )}

          <PasswordField
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
          />
          <PasswordField
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password (min 8 characters)"
          />
          <PrimaryButton
            label="Update Password"
            loadingLabel="Updating..."
            loading={changePassword.isPending}
            disabled={!currentPassword || !newPassword}
            onPress={handleChangePassword}
          />
        </View>

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <DangerButton label="Sign Out" onPress={confirmLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}
