import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type PasswordFieldProps = Omit<TextInputProps, "secureTextEntry"> & {
  containerClassName?: string;
};

export function PasswordField({ containerClassName, ...inputProps }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View
      className={`flex-row items-center rounded-xl border border-neutral-200 bg-input px-4 ${containerClassName ?? ""}`}
    >
      <TextInput
        {...inputProps}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 py-3 text-base text-text-primary"
        placeholderTextColor="#94a3b8"
      />
      <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
        {visible ? (
          <EyeOff size={20} color="#64748b" />
        ) : (
          <Eye size={20} color="#64748b" />
        )}
      </Pressable>
    </View>
  );
}
