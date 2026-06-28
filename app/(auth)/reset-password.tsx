import { useEffect, useState } from "react";
import { Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();

  const [exchanging, setExchanging] = useState(true);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) {
      setExchangeError("This reset link is invalid or has expired.");
      setExchanging(false);
      return;
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setExchangeError("This reset link is invalid or has expired.");
      }
      setExchanging(false);
    });
  }, [code]);

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSubmitting(false);

    if (error) {
      setValidationError(error.message);
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
    setTimeout(() => router.replace("/(auth)/login"), 2000);
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={["#0f172a", "#172554", "#1e293b"]} className="absolute inset-0" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-10">
          <View className="rounded-2xl bg-card p-6 shadow-lg">
            <Text className="mb-1 text-lg font-bold text-text-primary">Set New Password</Text>
            <Text className="mb-4 font-body text-sm text-text-secondary">
              Enter a new password for your account.
            </Text>

            {exchanging && (
              <Text className="font-body text-sm text-text-secondary">Verifying link...</Text>
            )}

            {!exchanging && exchangeError && (
              <View className="rounded-xl bg-danger-light p-3">
                <Text className="font-body text-sm font-medium text-danger">{exchangeError}</Text>
              </View>
            )}

            {!exchanging && !exchangeError && !success && (
              <>
                {validationError && (
                  <View className="mb-4 rounded-xl bg-danger-light p-3">
                    <Text className="font-body text-sm font-medium text-danger">
                      {validationError}
                    </Text>
                  </View>
                )}

                <Text className="mb-1 font-body text-sm font-medium text-text-secondary">
                  New Password
                </Text>
                <PasswordField
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  containerClassName="mb-4"
                />

                <Text className="mb-1 font-body text-sm font-medium text-text-secondary">
                  Confirm Password
                </Text>
                <PasswordField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  containerClassName="mb-4"
                />

                <PrimaryButton
                  label="Set New Password"
                  loadingLabel="Updating..."
                  loading={submitting}
                  disabled={!newPassword || !confirmPassword}
                  onPress={handleSubmit}
                />
              </>
            )}

            {success && (
              <View className="rounded-xl bg-success-light p-3">
                <Text className="font-body text-sm font-medium text-success">
                  Password updated successfully! Redirecting to login...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
