import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, Check } from "lucide-react-native";
import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { AvatarCircle } from "@/components/ui/AvatarCircle";
import { Badge } from "@/components/ui/Badge";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { DangerButton } from "@/components/ui/DangerButton";
import { ConfirmSheet } from "@/components/sheets/ConfirmSheet";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";
import { useAuth } from "@/hooks/auth/useAuth";
import { useChangePassword } from "@/hooks/shared/useChangePassword";
import { useUploadAvatar } from "@/hooks/shared/useUploadAvatar";
import { useCourses } from "@/hooks/teacher/useCourses";
import { formatDate } from "@/utils/date";

const PERMISSIONS = [
  "View assigned courses",
  "Create course announcements",
  "Record audio lessons",
  "Manage student grades",
  "View enrolled students",
  "Update account password",
];

export default function TeacherProfile() {
  const { profile, signOut } = useAuth();
  const sheet = useAppBottomSheet();
  const { data: courses = [] } = useCourses();
  const uploadAvatar = useUploadAvatar();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    uploadAvatar.mutate({
      uri: asset.uri,
      name: asset.fileName ?? "avatar.jpg",
      type: asset.mimeType ?? "image/jpeg",
    });
  };

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
      <Header title="Profile" />
      <ScrollView contentContainerClassName="gap-4 p-4">
        <HeroBanner eyebrow="Profile" title="Lecturer Profile" />

        <View className="items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
          <Pressable onPress={handlePickAvatar} className="relative">
            <AvatarCircle name={profile?.full_name ?? "?"} avatarUrl={profile?.avatar_url} size={72} />
            <View className="absolute -bottom-1 -right-1 rounded-full bg-primary-600 p-1.5">
              <Camera size={14} color="#ffffff" />
            </View>
          </Pressable>
          <Text className="text-base font-semibold text-text-primary">{profile?.full_name}</Text>
          <Badge label="Teacher" bgColor="#f5f3ff" textColor="#6d28d9" />
        </View>

        <View className="gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Account Overview</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="w-[47%] gap-1">
              <Text className="text-xs uppercase text-text-muted">Email</Text>
              <Text className="text-sm font-medium text-text-primary">{profile?.email}</Text>
            </View>
            <View className="w-[47%] gap-1">
              <Text className="text-xs uppercase text-text-muted">Assigned Courses</Text>
              <Text className="text-sm font-medium text-text-primary">{courses.length}</Text>
            </View>
            <View className="w-[47%] gap-1">
              <Text className="text-xs uppercase text-text-muted">Created</Text>
              <Text className="text-sm font-medium text-text-primary">
                {formatDate(profile?.created_at)}
              </Text>
            </View>
            <View className="w-[47%] gap-1">
              <Text className="text-xs uppercase text-text-muted">Role</Text>
              <Text className="text-sm font-medium text-text-primary">Teacher</Text>
            </View>
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

        <View className="gap-2 rounded-2xl bg-card p-4 shadow-sm">
          <Text className="text-base font-bold text-text-primary">Permissions</Text>
          {PERMISSIONS.map((permission) => (
            <View key={permission} className="flex-row items-center gap-2">
              <Check size={16} color="#10b981" />
              <Text className="text-sm text-text-secondary">{permission}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl bg-card p-4 shadow-sm">
          <DangerButton label="Sign Out" onPress={confirmLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
