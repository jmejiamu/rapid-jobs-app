import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";

import { ImageObject } from "@/src/types/imgUploader";
import { colors } from "@/src/theme/colors";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";

interface ImageUploaderProps {
  image?: ImageObject;
  setModalVisible: () => void;
  loadingImage: boolean;
  setLoadingImage: (loading: boolean) => void;
  stylesContainer?: StyleProp<ViewStyle>;
  onDeleteImage: () => void;
}

export const ImageUploader = (props: ImageUploaderProps) => {
  const {
    image,
    setModalVisible,
    loadingImage,
    setLoadingImage,
    stylesContainer,
    onDeleteImage,
  } = props;

  // Delete image from S3 via backend
  const handleDeleteImage = async (url: string) => {
    const imageKey = url.split("/").pop();
    await fetch(`${API_URL}/image/delete-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageKey }),
    });
    // Then update your local state to remove the image
    onDeleteImage();
  };

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
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteImage(image.sm)}
            accessibilityLabel="Delete image"
          >
            <AntDesign name="delete" size={16} color={colors.surface} />
          </TouchableOpacity>
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
