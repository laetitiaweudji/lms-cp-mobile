import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DangerButton } from "@/components/ui/DangerButton";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";
import { useAuth } from "@/hooks/auth/useAuth";
import { useChangePassword } from "@/hooks/shared/useChangePassword";
import { useChildren } from "@/hooks/parent/useChildren";

function ChangePasswordSheet({ onDone }: { onDone: () => void }) {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      { onSuccess: onDone, onError: (err) => setError(err.message) }
    );
  };

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-text-primary">Change Password</Text>
      {error && <Text className="text-sm font-medium text-danger">{error}</Text>}
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
        onPress={handleSubmit}
      />
    </View>
  );
}

export default function ParentProfile() {
  const { profile, signOut } = useAuth();
  const sheet = useAppBottomSheet();
  const { data: childrenData } = useChildren();
  const children = childrenData?.children ?? [];

  const openChangePassword = () => {
    sheet.open(<ChangePasswordSheet onDone={sheet.close} />, { mode: "center" });
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
      <Header title="Profile" />
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Personal Information</Text>
          <View>
            <Text className="text-xs uppercase text-text-muted">Full Name</Text>
            <Text className="text-sm font-medium text-text-primary">{profile?.full_name}</Text>
          </View>
          <View>
            <Text className="text-xs uppercase text-text-muted">Email</Text>
            <Text className="text-sm font-medium text-text-primary">{profile?.email}</Text>
          </View>
          <View>
            <Text className="text-xs uppercase text-text-muted">Role</Text>
            <Text className="text-sm font-medium text-text-primary">Parent</Text>
          </View>
        </View>

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Linked Students</Text>
          {children.length === 0 ? (
            <Text className="text-sm text-text-muted">No students linked to your account.</Text>
          ) : (
            children.map((child) => (
              <View
                key={child.student_id}
                className="flex-row items-center justify-between border-t border-neutral-100 pt-2"
              >
                <View>
                  <Text className="text-sm font-medium text-text-primary">
                    {child.profiles.full_name}
                  </Text>
                  <Text className="text-xs text-text-muted">{child.profiles.email}</Text>
                </View>
                <Badge label="Student" bgColor="#f0fdfa" textColor="#0f766e" />
              </View>
            ))
          )}
        </View>

        <View className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Security</Text>
          <Pressable onPress={openChangePassword}>
            <Text className="text-sm font-semibold text-primary-600">Change Password</Text>
          </Pressable>
        </View>

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <DangerButton label="Sign Out" onPress={confirmLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
