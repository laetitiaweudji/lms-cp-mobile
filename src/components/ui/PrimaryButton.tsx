import { ActivityIndicator, Pressable, Text, View, type PressableProps } from "react-native";

type PrimaryButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
};

export function PrimaryButton({
  label,
  loading,
  loadingLabel,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      className={`h-12 items-center justify-center rounded-xl bg-primary-600 ${
        isDisabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="#ffffff" />
          <Text className="text-base font-semibold text-text-inverse">
            {loadingLabel ?? label}
          </Text>
        </View>
      ) : (
        <Text className="text-base font-semibold text-text-inverse">{label}</Text>
      )}
    </Pressable>
  );
}
