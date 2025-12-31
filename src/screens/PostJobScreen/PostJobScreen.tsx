import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { ImagePickerModal, ImageUploader, MainButton } from "@/src/components";
import CustomInput from "@/src/components/CustomInput/CustomInput";
import { ImageObject } from "@/src/types/imgUploader";
import { PostJobType } from "@/src/types/postjob";
import { RootState } from "@/src/redux/store";
import { schema } from "./schema/formSchema";
import { colors } from "@/src/theme/colors";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";

const PostJobScreen = () => {
  const categoryData = [
    { label: "Cleaning", value: "cleaning" },
    { label: "Gardening", value: "gardening" },
    { label: "Painting", value: "painting" },
    { label: "Moving", value: "moving" },
    { label: "Repairs", value: "repairs" },
    { label: "Assembly", value: "assembly" },
    { label: "Other", value: "other" },
  ];
  const [category, setCategory] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [images, setImages] = useState<ImageObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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
      category: "",
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
      category: data.category,
    };
    try {
      const response = await fetch(`${API_URL}/jobs/create-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to post job");
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
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
        </View>

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
                <MaterialIcons name="bolt" size={14} color={colors.primary} />
                <Text style={styles.infoChipText}>Quick match</Text>
              </View>
              <View style={styles.infoChip}>
                <MaterialIcons name="photo-library" size={14} color={colors.primary} />
                <Text style={styles.infoChipText}>Up to 4 photos</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Text style={styles.sectionSubtitle}>
              Provide the essentials. Clear details lead to better applicants.
            </Text>

            <View style={styles.fieldGroup}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons name="work-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Job Title</Text>
              </View>
              <CustomInput
                control={control}
                name="title"
                placeholder="e.g. Furniture assembly"
                error={errors.title?.message}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons name="attach-money" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Budget</Text>
              </View>
              <CustomInput
                control={control}
                name="pay"
                placeholder="Enter amount (e.g. 50)"
                error={errors.pay?.message}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Location</Text>
              </View>
              <CustomInput
                control={control}
                name="address"
                placeholder="Street address or area"
                error={errors.address?.message}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons name="description" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Description</Text>
              </View>
              <CustomInput
                control={control}
                name="description"
                placeholder="Share timing, scope, tools required..."
                error={errors.description?.message}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.inputLabelRow}>
                <MaterialIcons name="category" size={16} color={colors.textSecondary} />
                <Text style={styles.inputLabel}>Category</Text>
              </View>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocused && styles.dropdownFocused,
                    ]}
                    data={categoryData}
                    labelField="label"
                    valueField="value"
                    placeholder="Select a category"
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    iconStyle={styles.dropdownIcon}
                    value={value}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(item) => {
                      onChange(item.value);
                      setIsFocused(false);
                    }}
                    renderLeftIcon={() => (
                      <MaterialCommunityIcons
                        name="shape-outline"
                        size={18}
                        color={colors.textSecondary}
                        style={{ marginRight: 10 }}
                      />
                    )}
                  />
                )}
              />
              {errors.category && (
                <Text style={styles.errorText}>{errors.category.message}</Text>
              )}
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <Text style={styles.sectionCount}>{uploadedCount}/4</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Add photos to help professionals understand the job better.
            </Text>

            <View style={styles.tipCard}>
              <Ionicons name="bulb-outline" size={18} color={colors.info} />
              <Text style={styles.tipText}>
                Jobs with photos get 3x more responses. Show the work area, materials, or examples of what you need.
              </Text>
            </View>

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
              if (!updated[selectedIndex]) {
                updated[selectedIndex] = newImage;
                return updated;
              } else {
                updated[selectedIndex] = newImage;
                return updated;
              }
            });
          } else {
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
