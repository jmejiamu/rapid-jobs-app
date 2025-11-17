import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { ImagePickerModal, ImageUploader, MainButton } from "@/src/components";
import CustomInput from "@/src/components/CustomInput/CustomInput";
import { ImageObject } from "@/src/types/imgUploader";
import { PostJobType } from "@/src/types/postjob";
import { RootState } from "@/src/redux/store";
import { schema } from "./schema/formSchema";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";

const PostJobScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<ImageObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  //TODO: Refactor this later
  const [loadingImages, setLoadingImages] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const token = useSelector((state: RootState) => state.auth.token);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const onSubmit = async (data: PostJobType) => {
    const filteredImages = images.filter((img) => img != null);
    const body = {
      title: data.title,
      pay: data.pay,
      address: data.address,
      description: data.description,
      images: filteredImages,
    };
    try {
      const response = await fetch(`${API_URL}/jobs/create-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  const handleModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleLoading = (index: number, loading: boolean) => {
    setLoadingImages((prev) => {
      const updated = [...prev];
      updated[index] = loading;
      return updated;
    });
  };

  const handleDelete = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadedCount = images.filter((image) => Boolean(image)).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={35} color="black" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>Post a Job</Text>
            <Text style={styles.subHeader}>
              Describe the task with clarity so pros can respond fast.
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>Average match &lt; 1hr</Text>
              </View>
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>Up to 4 photos</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Job details</Text>
            <Text style={styles.sectionSubtitle}>
              Provide the essentials. Clear details lead to better applicants.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Job title</Text>
              <CustomInput
                control={control}
                name="title"
                placeholder="e.g. Furniture assembly"
                error={errors.title?.message}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Budget</Text>
              <CustomInput
                control={control}
                name="pay"
                placeholder="Pay (Cash)"
                error={errors.pay?.message}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <CustomInput
                control={control}
                name="address"
                placeholder="Address"
                error={errors.address?.message}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <CustomInput
                control={control}
                name="description"
                placeholder="Share timing, scope, tools required..."
                error={errors.description?.message}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Visual references</Text>
              <Text style={styles.sectionCount}>{uploadedCount}/4</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Upload inspiration or on-site photos so professionals know what to
              expect.
            </Text>

            <View style={styles.imageGrid}>
              <View style={styles.imageRow}>
                {[0, 1].map((index) => (
                  <ImageUploader
                    key={index}
                    image={images[index]}
                    setModalVisible={() => handleModal(index)}
                    loadingImage={loadingImages[index]}
                    setLoadingImage={(loading) => {
                      handleLoading(index, loading);
                    }}
                    stylesContainer={index === 0 ? { marginRight: 12 } : {}}
                    onDeleteImage={() => {
                      handleDelete(index);
                    }}
                  />
                ))}
              </View>
              <View style={styles.imageRow}>
                {[2, 3].map((index) => (
                  <ImageUploader
                    key={index}
                    image={images[index]}
                    setModalVisible={() => handleModal(index)}
                    loadingImage={loadingImages[index]}
                    setLoadingImage={(loading) => {
                      handleLoading(index, loading);
                    }}
                    stylesContainer={index === 2 ? { marginRight: 12 } : {}}
                    onDeleteImage={() => {
                      handleDelete(index);
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.submitWrapper}>
          <MainButton title="Post Job" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>

      <ImagePickerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onImagePicked={(newImage) => {
          if (selectedIndex !== null) {
            setImages((prev) => {
              const updated = [...prev];
              // If slot is empty, insert image
              if (!updated[selectedIndex]) {
                updated[selectedIndex] = newImage;
                return updated;
              } else {
                // Replace image at index
                updated[selectedIndex] = newImage;
                return updated;
              }
            });
          } else {
            // If no index selected, append to end (up to 4)
            setImages((prev) => {
              if (prev.length < 4) {
                return [...prev, newImage];
              }
              return prev;
            });
          }
        }}
        setLoadingImage={(loading) => {
          if (selectedIndex !== null) {
            setLoadingImages((prev) => {
              const updated = [...prev];
              updated[selectedIndex] = loading;
              return updated;
            });
          }
        }}
      />
    </SafeAreaView>
  );
};

export default PostJobScreen;
