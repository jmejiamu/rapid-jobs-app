import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: 4,
  },
  scrollContainer: {
    paddingBottom: 140,
  },
  headerWrapper: {
    marginTop: 10,
    marginBottom: 24,
  },
  header: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  subHeader: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  infoChip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(25,118,210,0.15)",
  },
  infoChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    fontWeight: "600",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCount: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "700",
  },
  imageGrid: {
    marginTop: 12,
  },
  imageRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  submitWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
});
