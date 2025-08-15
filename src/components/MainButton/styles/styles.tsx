import { fontSize } from "@/src/theme/fontStyle";
import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textVariant: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.primary,
  },
  textText: {
    color: colors.textSecondary,
  },

  //Button Sizes styles

  buttonSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 32,
  },
  buttonMd: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  buttonLg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  textSm: {
    fontSize: 14,
    fontWeight: "500",
  },
  textMd: {
    fontSize: 16,
    fontWeight: "600",
  },
  textLg: {
    fontSize: 18,
    fontWeight: "700",
  },
});
