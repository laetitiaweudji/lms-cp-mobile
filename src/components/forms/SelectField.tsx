import { Pressable, Text, View } from "react-native";
import { useAppBottomSheet } from "@/components/sheets/useAppBottomSheet";

type Option<T extends string> = { label: string; value: T };

type SelectFieldProps<T extends string> = {
  label: string;
  placeholder: string;
  value: T | null;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function SelectField<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: SelectFieldProps<T>) {
  const sheet = useAppBottomSheet();
  const selected = options.find((o) => o.value === value);

  const openPicker = () => {
    if (disabled) return;
    sheet.open(
      <View className="gap-1">
        <Text className="mb-2 text-lg font-bold text-text-primary">{label}</Text>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => {
              onChange(option.value);
              sheet.close();
            }}
            className="rounded-xl px-4 py-3 active:bg-neutral-100"
          >
            <Text className="text-base text-text-primary">{option.label}</Text>
          </Pressable>
        ))}
      </View>,
      { mode: "slide" }
    );
  };

  return (
    <View>
      <Text className="mb-1 text-sm font-medium text-text-secondary">{label}</Text>
      <Pressable
        onPress={openPicker}
        disabled={disabled}
        className={`rounded-xl border border-neutral-200 bg-input px-4 py-3 ${disabled ? "opacity-50" : ""}`}
      >
        <Text className={selected ? "text-base text-text-primary" : "text-base text-text-muted"}>
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>
    </View>
  );
}
