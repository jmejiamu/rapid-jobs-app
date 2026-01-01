import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
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
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

type DetailJobRouteProp = RouteProp<RootStackParamList, "DetailJob">;

const DetailJobScreen = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<DetailJobRouteProp>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { job } = route.params;

  const heroImage =
    job.images && job.images.length > 0
      ? job.images[0].lg || job.images[0].original
      : undefined;
  const galleryImages = job.images && job.images.length >= 1 ? job.images : [];

  const handleChatPress = () => {
    navigation.navigate("ChatDetail", {
      job: {
        jobId: job?._id ?? "",
        // job.userId can be either a string or an object like { _id: string; ... }
        // prefer the string id when present, otherwise extract _id from the object
        otherUserId:
          typeof job?.userId === "string"
            ? (job.userId as string)
            : job?.userId?._id ?? "",
      },
    });
  };

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
                <Image
                  key={`${image.filename}-${index}`}
                  source={{ uri: image.sm || image.original }}
                  style={styles.galleryImage}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
      {userId !== job?.userId && (
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[
              styles.chatButton,
              !accessToken && { backgroundColor: "#cccccc" },
            ]}
            activeOpacity={0.9}
            onPress={handleChatPress}
            disabled={!accessToken}
          >
            <AntDesign name="message" size={24} color={colors.surface} />
            <Text style={styles.chatButtonText}>Chat about this job</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DetailJobScreen;

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
  },
  chatButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  chatButtonText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: "600",
    marginLeft: 8,
  },
});
