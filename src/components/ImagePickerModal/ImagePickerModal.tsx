import React, { useRef, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

import { ImageObject } from "@/src/types/imgUploader";
import { CameraShutter } from "../CameraShutter";
import { colors } from "@/src/theme/colors";
import { MainButton } from "../MainButton";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";

interface ImagePickerProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onImagePicked: (image: ImageObject) => void;
  setLoadingImage: (loading: boolean) => void;
}

export const ImagePickerModal = (props: ImagePickerProps) => {
  const { modalVisible, setModalVisible, onImagePicked, setLoadingImage } =
    props;
  const cameraRef = useRef<CameraView>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const toggleCameraVisibility = async () => {
    console.log("Permission  granted", permission?.granted);
    if (!permission?.granted) {
      Alert.alert(
        "Permission required",
        "Please go to settings and enable camera permission, if you did not allow it the first time",
        [
          {
            text: "OK",
            onPress: async () => {
              const { granted } = await requestPermission();
              if (granted) {
                setIsCameraVisible(true);
              }
            },
          },
        ]
      );
    } else {
      setIsCameraVisible(true);
    }
  };

  const handlePickCamera = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setIsCameraVisible(false);
        setModalVisible(false);
        uploadCameraPicture(photo?.uri);
      }
    }
  };

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

  const uploadCameraPicture = async (uri: string) => {
    setLoadingImage(true);
    const formData = new FormData();

    const imageToUpload: any = {
      uri: uri,
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
      if (data.images && data.images.length > 0) {
        onImagePicked(data.images[0]);
      }
    } catch (e) {
      console.log("error", e);
      setLoadingImage(false);
    } finally {
      setLoadingImage(false);
      setIsCameraVisible(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      {isCameraVisible ? (
        <CameraShutter
          closeCamera={() => setIsCameraVisible(false)}
          isCameraVisible={isCameraVisible}
          takePicture={handlePickCamera}
          cameraRef={cameraRef}
        />
      ) : (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Text style={styles.title}>Select Image Source</Text>
              <View style={styles.rowContainer}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <View style={{ alignItems: "center" }}>
                      <AntDesign name="picture" size={40} color="black" />
                      <Text style={styles.buttonText}>Gallery</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ margin: 10 }} />
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={toggleCameraVisibility}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Feather name="camera" size={40} color="black" />
                      <Text style={styles.buttonText}>Camera</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <MainButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                size="md"
                style={{ marginTop: 10, backgroundColor: colors.error }}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
