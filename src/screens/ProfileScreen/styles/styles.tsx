import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: "flex-end",
    marginLeft: 16,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: 32,
  },
  backArrow: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  backArrowText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
    backgroundColor: "#D8D8D8",
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  verified: {
    color: colors.success,
    fontWeight: "500",
  },
  button: {
    width: "80%",
    backgroundColor: "#A9A9A9",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
    opacity: 0.8,
  },
  buttonText: {
    fontSize: fontSize.sm,
    color: colors.surface,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginVertical: 16,
  },
});
