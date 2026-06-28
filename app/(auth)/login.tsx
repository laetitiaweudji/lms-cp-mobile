import { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { PasswordField } from "@/components/ui/PasswordField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLockout } from "@/hooks/auth/useLockout";
import { supabase } from "@/lib/supabase/client";
import * as Linking from "expo-linking";

const FEATURE_CHIPS = ["4 Roles", "24/7 Access", "SSL Secure"];

export default function LoginScreen() {
  const { signIn, status, acknowledgeAdminRejection } = useAuth();
  const lockout = useLockout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "admin_rejected") {
      setErrorMessage("Admin accounts should use the web portal.");
      acknowledgeAdminRejection();
    }
  }, [status, acknowledgeAdminRejection]);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async () => {
    if (lockout.isLocked || signingIn) return;
    setErrorMessage(null);
    setSigningIn(true);
    const result = await signIn(email.trim(), password);
    setSigningIn(false);

    if (result.status === "success") {
      lockout.reset();
      router.replace("/");
      return;
    }

    if (result.status === "admin_rejected") {
      setErrorMessage("Admin accounts should use the web portal.");
      return;
    }

    lockout.recordFailure();
    setErrorMessage(`Invalid credentials. ${lockout.attemptsRemaining - 1} attempt(s) remaining.`);
  };

  const handleSendReset = async () => {
    if (sendingReset) return;
    setSendingReset(true);
    await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: Linking.createURL("reset-password"),
    });
    setSendingReset(false);
    setResetSent(true);
  };

  const closeForgotModal = () => {
    setForgotOpen(false);
    setResetEmail("");
    setResetSent(false);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0f172a", "#172554", "#1e293b"]}
        className="absolute inset-0"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-1 justify-center px-6 py-10">
          <View className="mb-8 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
              <Text className="font-serif text-2xl font-bold text-text-inverse">SCP</Text>
            </View>
            <Text className="font-serif text-2xl font-bold text-text-inverse">SCP Portal</Text>
            <Text className="mt-1 font-body text-sm text-neutral-300">
              School Communication Platform
            </Text>
          </View>

          <Text className="mb-4 text-center font-serif text-xl font-semibold text-text-inverse">
            A smarter way to manage school communication
          </Text>

          <View className="mb-8 flex-row justify-center gap-2">
            {FEATURE_CHIPS.map((chip) => (
              <View key={chip} className="rounded-full bg-white/10 px-3 py-1">
                <Text className="font-body text-xs text-neutral-200">{chip}</Text>
              </View>
            ))}
          </View>

          <View className="rounded-2xl bg-card p-6 shadow-lg">
            {lockout.isLocked && (
              <View className="mb-4 rounded-xl bg-warning-light p-3">
                <Text className="font-body text-sm font-medium text-warning">
                  Account locked. Try again in {lockout.remainingSeconds}s.
                </Text>
              </View>
            )}

            {errorMessage && !lockout.isLocked && (
              <View className="mb-4 rounded-xl bg-danger-light p-3">
                <Text className="font-body text-sm font-medium text-danger">{errorMessage}</Text>
              </View>
            )}

            <Text className="mb-1 font-body text-sm font-medium text-text-secondary">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@school.edu"
              placeholderTextColor="#94a3b8"
              className="mb-4 rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
            />

            <Text className="mb-1 font-body text-sm font-medium text-text-secondary">
              Password
            </Text>
            <PasswordField
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              containerClassName="mb-2"
            />

            <Pressable onPress={() => setForgotOpen(true)} className="mb-4 self-end">
              <Text className="font-body text-sm font-medium text-primary-600">
                Forgot password?
              </Text>
            </Pressable>

            <PrimaryButton
              label="Sign In"
              loadingLabel="Signing in..."
              loading={signingIn || status === "loading"}
              disabled={lockout.isLocked || !email || !password}
              onPress={handleSignIn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={closeForgotModal}>
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-card p-6">
            <Text className="mb-1 text-lg font-bold text-text-primary">Reset Password</Text>
            <Text className="mb-4 font-body text-sm text-text-secondary">
              Enter your email to receive a secure reset link.
            </Text>

            {resetSent ? (
              <Text className="mb-4 font-body text-sm font-medium text-success">
                Reset link sent! Check your email.
              </Text>
            ) : (
              <TextInput
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="you@school.edu"
                placeholderTextColor="#94a3b8"
                className="mb-4 rounded-xl border border-neutral-200 bg-input px-4 py-3 text-base text-text-primary"
              />
            )}

            <View className="flex-row gap-3">
              <View className="flex-1">
                <SecondaryButton label="Cancel" onPress={closeForgotModal} />
              </View>
              {!resetSent && (
                <View className="flex-1">
                  <PrimaryButton
                    label="Send Reset Link"
                    loadingLabel="Sending..."
                    loading={sendingReset}
                    disabled={!resetEmail}
                    onPress={handleSendReset}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
