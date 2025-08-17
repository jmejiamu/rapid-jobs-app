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
});
