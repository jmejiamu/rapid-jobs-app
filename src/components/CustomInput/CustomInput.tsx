import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  Text,
  View,
} from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

import { colors } from "../../theme/colors";
import { fontSize } from "../../theme/fontStyle";

interface CustomInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

function CustomInput<T extends FieldValues>({
  control,
  name,
  error,
  style,
  multiline,
  ...props
}: CustomInputProps<T>) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                { marginBottom: !!error ? 0 : 15 },
                multiline && styles.textArea,
                style,
              ]}
              placeholderTextColor={colors.textSecondary}
              multiline={multiline}
              value={value}
              onChangeText={onChange}
              {...props}
            />
            {error && (
              <Text style={{ color: colors.error, marginVertical: 5 }}>
                {error}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: fontSize.sm,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 10,
    height: undefined,
  },
});

export default CustomInput;
