import { Pressable, Text, type PressableProps } from "react-native";

type SecondaryButtonProps = PressableProps & {
  label: string;
  className?: string;
};

export function SecondaryButton({ label, className, disabled, ...props }: SecondaryButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      className={`h-12 items-center justify-center rounded-xl border border-neutral-200 bg-card ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Text className="text-base font-semibold text-text-primary">{label}</Text>
    </Pressable>
  );
}
