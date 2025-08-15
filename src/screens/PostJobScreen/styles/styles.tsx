import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: colors.textPrimary,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "500",
  },

  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  imageGrid: {
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  imageThumbWrapper: {
    position: "relative",
    flex: 1,
    aspectRatio: 1,
    maxWidth: "50%",
  },
  imageThumb: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    backgroundColor: colors.surface,
  },
  imageThumbPlaceholder: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: "50%",
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  deleteButton: {
    position: "absolute",
    top: -8,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  deleteText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center",
  },
  imageUpload: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: "50%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  uploadText: {
    fontSize: fontSize.xl,
    color: colors.primary,
    fontWeight: "bold",
  },
});
