import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";
import { fontSize } from "../../theme/fontStyle";

const { width, height } = Dimensions.get("window");

interface OnboardingCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {children && <View style={styles.imageContainer}>{children}</View>}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 320,
  },
  imageContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
