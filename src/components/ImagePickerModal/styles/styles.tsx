import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: 250,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    textAlign: "center",
    color: "red",
  },
});
