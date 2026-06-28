import { Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { DangerButton } from "@/components/ui/DangerButton";

type ConfirmSheetProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmSheet({
  title,
  message,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-lg font-bold text-text-primary">{title}</Text>
        <Text className="mt-1 font-body text-sm text-text-secondary">{message}</Text>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1">
          <SecondaryButton label="Cancel" onPress={onCancel} />
        </View>
        <View className="flex-1">
          {destructive ? (
            <DangerButton label={confirmLabel} onPress={onConfirm} />
          ) : (
            <PrimaryButton label={confirmLabel} onPress={onConfirm} />
          )}
        </View>
      </View>
    </View>
  );
}
