import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.background,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  pay: {
    fontSize: fontSize.md,
    color: colors.success,
    marginBottom: 4,
    fontWeight: "600",
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.info,
    textAlign: "right",
  },
});
