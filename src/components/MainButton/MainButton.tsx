import React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles/styles";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "text";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export const MainButton = (props: OnboardingButtonProps) => {
  const {
    title,
    onPress,
    variant = "primary",
    disabled = false,
    style,
    textStyle,
    loading = false,
    size = "md",
  } = props;

  // Map size to style keys
  const buttonSizeMap: Record<"sm" | "md" | "lg", keyof typeof styles> = {
    sm: "buttonSm",
    md: "buttonMd",
    lg: "buttonLg",
  };
  const textSizeMap: Record<"sm" | "md" | "lg", keyof typeof styles> = {
    sm: "textSm",
    md: "textMd",
    lg: "textLg",
  };

  const sizeStyle: ViewStyle = styles[buttonSizeMap[size]] as ViewStyle;
  const textSizeStyle: TextStyle = styles[textSizeMap[size]] as TextStyle;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyle,
        variant === "text" ? styles.textVariant : styles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={styles[`${variant}Text`]?.color || undefined}
        />
      ) : (
        <Text
          style={[
            styles.text,
            textSizeStyle,
            styles[`${variant}Text`],
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
