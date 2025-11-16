import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { colors } from "../../theme/colors";
import { fontSize } from "../../theme/fontStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  EvilIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { API_URL } from "@/config/api";

type DetailJobRouteProp = RouteProp<RootStackParamList, "JobPostDetail">;

const JobPostDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<DetailJobRouteProp>();
  const { job } = route.params ?? {};
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Job not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const heroImage =
    job.images && job.images.length > 0
      ? job.images[0].lg || job.images[0].original
      : undefined;
  const galleryImages = job.images && job.images.length >= 1 ? job.images : [];

  const handleImagePress = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/jobs/delete-job/${job._id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (!response.ok) throw new Error("Failed to delete job");
              Alert.alert("Success", "Job deleted successfully.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting job:", error);
              Alert.alert("Error", "Failed to delete job. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleUpdate = () => {
    navigation.navigate("PostJob", { job });
  };

  const isOwner =
    userId === (typeof job.userId === "string" ? job.userId : job.userId?._id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          {heroImage ? (
            <ImageBackground
              source={{ uri: heroImage }}
              style={styles.heroImage}
              imageStyle={styles.heroImageRadius}
            >
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{job.title}</Text>
                <View style={styles.heroChips}>
                  <View style={styles.heroChip}>
                    <MaterialIcons
                      name="attach-money"
                      size={18}
                      color={colors.surface}
                    />
                    <Text style={styles.heroChipText}>{job.pay}</Text>
                  </View>
                  {job.address ? (
                    <View style={styles.heroChip}>
                      <EvilIcons
                        name="location"
                        size={18}
                        color={colors.surface}
                      />
                      <Text style={styles.heroChipText} numberOfLines={1}>
                        {job.address}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.heroFallback}>
              <View style={styles.fallbackIcon}>
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.heroTitleAlt}>{job.title}</Text>
              {job.address ? (
                <Text style={styles.heroSubtitleAlt}>{job.address}</Text>
              ) : null}
            </View>
          )}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Job Overview</Text>
          <View style={styles.detailRow}>
            <MaterialIcons
              name="attach-money"
              size={22}
              color={colors.primary}
            />
            <Text style={styles.detailText}>{job.pay}</Text>
          </View>
          {job.address ? (
            <View style={styles.detailRow}>
              <EvilIcons name="location" size={24} color={colors.secondary} />
              <Text style={styles.detailText}>{job.address}</Text>
            </View>
          ) : null}
          {job.postedAt ? (
            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={20} color={colors.accent} />
              <Text style={styles.detailText}>
                Posted on{" "}
                {new Date(job.postedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this job</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>
        {galleryImages.length > 0 ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.galleryGrid}>
              {galleryImages.map((image, index) => (
                <TouchableOpacity
                  key={`${image.filename}-${index}`}
                  onPress={() => handleImagePress(image.sm || image.original)}
                  style={styles.galleryImage}
                >
                  <Image
                    source={{ uri: image.sm || image.original }}
                    style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
      {isOwner && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            activeOpacity={0.9}
            onPress={handleUpdate}
          >
            <Text style={styles.actionButtonText}>Update Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            activeOpacity={0.9}
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>Delete Job</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImg} />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default JobPostDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.error,
  },
  heroWrapper: {
    marginBottom: 24,
  },
  heroImage: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImageRadius: {
    borderRadius: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.surface,
    marginBottom: 12,
  },
  heroChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: "85%",
    marginRight: 8,
    marginBottom: 8,
  },
  heroChipText: {
    color: colors.surface,
    marginLeft: 6,
    fontSize: fontSize.sm,
  },
  heroFallback: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  fallbackIcon: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}22`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitleAlt: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  heroSubtitleAlt: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  detailText: {
    marginLeft: 12,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryImage: {
    width: "48%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  ctaContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 4,
  },
  updateButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  modalImg: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
});
