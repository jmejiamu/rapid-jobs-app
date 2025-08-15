import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomInput from "@/src/components/CustomInput/CustomInput";
import { PostJobType } from "@/src/types/postjob";
import * as ImagePicker from "expo-image-picker";
import { MainButton } from "@/src/components";
import { schema } from "./schema/formSchema";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";

const PostJobScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostJobType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      pay: "",
      address: "",
      description: "",
    },
  });

  const pickImage = async () => {
    if (images.length >= 4) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const onSubmit = async (data: PostJobType) => {
    const body = {
      title: data.title,
      pay: data.pay,
      address: data.address,
      description: data.description,
    };
    try {
      const response = await fetch(`${API_URL}/jobs/create-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to post job");
      // Optionally get the posted job data
      // const job = await response.json();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to post job");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={35} color="black" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>Post a Job</Text>

          <CustomInput
            control={control}
            name="title"
            placeholder="Job Title"
            error={errors.title?.message}
          />

          <CustomInput
            control={control}
            name="pay"
            placeholder="Pay (Cash)"
            error={errors.pay?.message}
            keyboardType="numeric"
          />

          <CustomInput
            control={control}
            name="address"
            placeholder="Address"
            error={errors.address?.message}
          />

          <CustomInput
            control={control}
            name="description"
            placeholder="Description"
            error={errors.description?.message}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Upload Images (max 4)</Text>
          {/* TODO: Implement image upload, make this reusable */}
          <View style={styles.imageGrid}>
            {[0, 1].map((row) => (
              <View key={row} style={styles.imageRow}>
                {[0, 1].map((col) => {
                  const idx = row * 2 + col;
                  if (images[idx]) {
                    return (
                      <View key={idx} style={styles.imageThumbWrapper}>
                        <Image
                          source={{ uri: images[idx] }}
                          style={styles.imageThumb}
                        />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            setImages(images.filter((_, i) => i !== idx));
                          }}
                        >
                          <Text style={styles.deleteText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  } else if (images.length < 4 && idx === images.length) {
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.imageUpload}
                        onPress={pickImage}
                      >
                        <Text style={styles.uploadText}>+</Text>
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <View key={idx} style={styles.imageThumbPlaceholder} />
                    );
                  }
                })}
              </View>
            ))}
          </View>
          <View style={{ marginBottom: 50 }}>
            <MainButton title="Post Job" onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PostJobScreen;
