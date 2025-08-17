import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";

import { fontSize } from "@/src/theme/fontStyle";
import { colors } from "@/src/theme/colors";

export interface ImageObject {
  filename: string;
  original: string;
  sm: string;
  lg: string;
}

interface ImageUploaderProps {
  image?: ImageObject;
  setModalVisible: () => void;
  loadingImage: boolean;
  setLoadingImage: (loading: boolean) => void;
  stylesContainer?: StyleProp<ViewStyle>;
}

export const ImageUploader = (props: ImageUploaderProps) => {
  const {
    image,
    setModalVisible,
    loadingImage,
    setLoadingImage,
    stylesContainer,
  } = props;

  return (
    <View style={[styles.imageGrid, stylesContainer]}>
      {image ? (
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: image.sm }}
            style={styles.imageThumb}
            onLoadStart={() => setLoadingImage(true)}
            onLoadEnd={() => setLoadingImage(false)}
            onError={() => setLoadingImage(false)}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.imageUpload} onPress={setModalVisible}>
          {loadingImage && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
          {!loadingImage && <Text style={styles.uploadText}>+</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: 2,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  imageThumb: {
    height: 150,
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
  imageGrid: {
    marginBottom: 20,
    flex: 1,
  },
  deleteText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center",
  },
  imageUpload: {
    height: 150,
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
