import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { styles } from "./styles/styles";

interface CameraShutterProps {
  closeCamera: () => void;
  isCameraVisible: boolean;
  takePicture: () => Promise<void>;
  cameraRef: React.RefObject<CameraView | null>;
}

export const CameraShutter = (props: CameraShutterProps) => {
  const { closeCamera, isCameraVisible, takePicture, cameraRef } = props;
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return <View />;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <Modal
      visible={isCameraVisible}
      transparent={false}
      animationType="fade"
      onRequestClose={closeCamera}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 16,
            marginVertical: 20,
          }}
        >
          <TouchableOpacity onPress={closeCamera}>
            <Ionicons name="close-sharp" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={toggleCameraFacing}>
            {/* <Text style={styles.text}>Flip Camera</Text> */}
            <MaterialCommunityIcons
              name="camera-flip-outline"
              size={35}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <View style={styles.circle}>
                  <Feather name="camera" size={40} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
