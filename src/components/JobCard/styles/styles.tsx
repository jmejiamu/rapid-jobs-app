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
  dateTime: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  address: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.info,
    textAlign: "right",
  },
  // Image
  rowContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 15,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalImg: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
});
