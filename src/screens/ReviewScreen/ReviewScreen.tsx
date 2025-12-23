import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { apiFetch } from "@/src/utils/apiFetch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { API_URL } from "@/config/api";

type ReviewRouteProp = RouteProp<RootStackParamList, "Review">;

type RawUser =
  | string
  | {
      _id: string;
      name?: string;
      avatar?: string;
    }
  | undefined;

type ReviewTarget = {
  id: string;
  name: string;
};

type JobSummary = {
  _id: string;
  title?: string;
  pay?: string;
  address?: string;
  status?: string;
  userId?: RawUser;
  owner?: RawUser;
  postedBy?: RawUser;
  assignedTo?: RawUser;
  assignedUser?: RawUser;
  assignee?: RawUser;
};

const ratingLabels = [
  "Terrible",
  "Poor",
  "Average",
  "Great",
  "Excellent",
] as const;

const ReviewScreen = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const route = useRoute<ReviewRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const jobId = route.params?.jobId;
  const owner = route.params?.owner;
  const assignee = route.params?.assignee;
  const [job, setJob] = useState<JobSummary | null>(null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitReview = async () => {
    if (!jobId) {
      Alert.alert("Missing job", "We were not able to find this job.");
      return;
    }
    if (!rating) {
      setFeedback("Please select a star rating before submitting.");
      return;
    }

    setFeedback(null);
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/jobs/review/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          // prefer explicit selection, fall back to route params
          revieweeId:
            (owner as any)?.id === userId
              ? (assignee as any)?.id
              : (owner as any)?.id,
        }),
      });

      if (!response?.ok) {
        throw new Error("Unable to submit review right now");
      }

      setComment("");
      setRating(0);
      setFeedback("Thanks! Your review has been submitted.");
      Alert.alert("Success", "Your review was submitted.");
    } catch (error: any) {
      const message =
        error?.message ?? "Something went wrong while submitting the review.";
      setFeedback(message);
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderReviewTarget = (target: ReviewTarget) => {
    return (
      <TouchableOpacity
        key={target.id}
        style={[styles.personCard, styles.personCardSelected]}
        activeOpacity={0.9}
      >
        <View style={styles.personAvatar}>
          <Text style={styles.personInitial}>
            {target.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.personName}>{target.name}</Text>
          <Text style={styles.personSubtitle}>
            {target.id === owner?.id ? "Job Poster" : "Job Assignee"}
          </Text>
        </View>
        <MaterialIcons
          name={"radio-button-checked"}
          size={22}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave a Review</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Job</Text>
            {loadingJob ? (
              <View style={styles.rowCenter}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingLabel}>Loading job...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.jobTitle}>
                  {job?.title ?? "Recently completed job"}
                </Text>
                <Text style={styles.jobMeta}>
                  {job?.address ?? "Location shared privately"}
                </Text>
                {job?.pay ? (
                  <Text style={styles.jobMetaAccent}>Budget: {job.pay}</Text>
                ) : null}
                {job?.status ? (
                  <View style={styles.statusPill}>
                    <Text style={styles.statusText}>
                      {job.status?.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
                {!job && (
                  <Text style={styles.jobMeta}>
                    Job ID: {jobId?.slice(0, 8)}...
                  </Text>
                )}
              </>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Who are you reviewing?</Text>
            {owner?.id === userId
              ? renderReviewTarget(assignee as ReviewTarget)
              : renderReviewTarget(owner as ReviewTarget)}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Rate the experience</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setRating(value)}
                  style={styles.starWrapper}
                >
                  <MaterialIcons
                    name={value <= rating ? "star" : "star-border"}
                    size={36}
                    color={value <= rating ? colors.warning : "#C4C4C4"}
                  />
                  <Text style={styles.starLabel}>
                    {ratingLabels[value - 1]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.hint}>
              Tap a star to score 1 (low) through 5 (high).
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Share more details</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              placeholder="Tell others what went well or what could improve..."
              placeholderTextColor={colors.textSecondary}
              value={comment}
              onChangeText={setComment}
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.counter}>{`${comment.length}/500`}</Text>
          </View>

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          <MainButton
            title="Submit Review"
            onPress={handleSubmitReview}
            loading={submitting}
            disabled={submitting}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  jobMeta: {
    marginTop: 6,
    color: colors.textSecondary,
  },
  jobMetaAccent: {
    marginTop: 6,
    color: colors.secondary,
    fontWeight: "600",
  },
  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary + "22",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 10,
  },
  statusText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingLabel: {
    marginLeft: 8,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starWrapper: {
    alignItems: "center",
    flex: 1,
  },
  starLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textSecondary,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    color: colors.textPrimary,
  },
  counter: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
  },
  submitButton: {
    marginTop: 8,
  },
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    marginBottom: 12,
  },
  personCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "0D",
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  personInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  personName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  personSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyHint: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  feedback: {
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: 12,
  },
});
