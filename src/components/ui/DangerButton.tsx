import { Pressable, Text, type PressableProps } from "react-native";

type DangerButtonProps = PressableProps & {
  label: string;
  className?: string;
};

export function DangerButton({ label, className, disabled, ...props }: DangerButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      className={`h-12 items-center justify-center rounded-xl bg-danger ${
        disabled ? "opacity-50" : ""
      } ${className ?? ""}`}
    >
      <Text className="text-base font-semibold text-text-inverse">{label}</Text>
    </Pressable>
  );
}
