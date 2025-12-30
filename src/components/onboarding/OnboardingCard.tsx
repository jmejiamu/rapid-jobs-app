import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";
import { fontSize } from "../../theme/fontStyle";

const { width, height } = Dimensions.get("window");

interface OnboardingCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  backgroundColor?: string;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title,
  description,
  children,
  backgroundColor,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.top,
          { backgroundColor: backgroundColor || colors.background },
        ]}
      >
        {children && <View style={styles.imageContainer}>{children}</View>}
      </View>

      <View style={styles.contentContainer}>
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
  },
  contentContainer: {
    marginTop: 20,
  },
  imageContainer: {},
  textContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
    lineHeight: 34,
    paddingHorizontal: 25,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingHorizontal: 25,
  },

  top: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
});
