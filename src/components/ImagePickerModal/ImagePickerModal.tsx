import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { API_URL } from "@/config/api";
import { ImageObject } from "@/src/types/imgUploader";

interface ImagePickerProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onImagePicked: (image: ImageObject) => void;
  setLoadingImage: (loading: boolean) => void;
}

export const ImagePickerModal = (props: ImagePickerProps) => {
  const { modalVisible, setModalVisible, onImagePicked, setLoadingImage } =
    props;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setModalVisible(false);
      handleImageUpload(result);
    }
  };

  const handleImageUpload = async (image: ImagePicker.ImagePickerResult) => {
    if (image.canceled || !image.assets || image.assets.length === 0) return;
    setLoadingImage(true);

    const { uri } = image.assets[0];
    const formData = new FormData();
    const imageToUpload: any = {
      uri,
      type: "image/jpeg",
      name: `image_${Date.now()}.jpg`,
    };
    formData.append("images", imageToUpload);

    try {
      const response = await fetch(`${API_URL}/image/upload-images`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("🚀 ~ handleImageUpload ~ data:", data);
      if (data.images && data.images.length > 0) {
        onImagePicked(data.images[0]);
      }
      if (!response.ok) throw new Error("Failed to upload images");
    } catch (error) {
      Alert.alert("Error", "Failed to upload images");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Image Source</Text>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(false); /* TODO: Add camera picker logic here */
            }}
          >
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
