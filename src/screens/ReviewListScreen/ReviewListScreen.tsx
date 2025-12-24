import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { RootState } from "@/src/redux/store";
import { usePagination } from "@/src/hooks";
import { colors } from "@/src/theme/colors";

type Review = {
  _id: string;
  jobId?: string;
  reviewerId?: {
    _id?: string;
    name?: string;
    phone?: string;
  };
  rating: number;
  comment?: string;
  createdAt?: string;
};

const ReviewListScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const { data, loading, loadingMore, currentPage, totalPages, fetchData } =
    usePagination({
      endpoint: `/jobs/user-reviews/${userId}`,
      dataKey: "reviews", // key has to match backend response
      paginationKey: "pagination",
    });

  const reviews = useMemo(() => (data as Review[]) || [], [data]);
  const hasReviews = reviews.length > 0;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + (review?.rating ?? 0),
      0
    );
    return total / reviews.length;
  }, [reviews]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  }, [currentPage, totalPages, loading, loadingMore, fetchData]);

  const renderStars = (rating: number) => (
    <View style={styles.ratingRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons
          key={star}
          name={star <= rating ? "star" : "star-border"}
          size={18}
          color={colors.accent}
        />
      ))}
    </View>
  );

  const renderReviewCard = ({ item }: { item: Review }) => {
    const reviewerName = item?.reviewerId?.name ?? "Anonymous reviewer";
    const reviewDate = item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date unavailable";
    const jobSuffix = item?.jobId
      ? `#${item.jobId.slice(-6).toUpperCase()}`
      : undefined;

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {reviewerName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.reviewMetaContainer}>
            <Text style={styles.reviewerName}>{reviewerName}</Text>
            <Text style={styles.reviewMetaText}>{reviewDate}</Text>
          </View>
          {renderStars(item.rating)}
        </View>
        {item.comment ? (
          <Text style={styles.commentText}>{item.comment}</Text>
        ) : (
          <Text style={styles.commentPlaceholder}>
            No written feedback was provided.
          </Text>
        )}
        {jobSuffix ? (
          <View style={styles.jobTag}>
            <MaterialIcons
              name="work-outline"
              size={16}
              color={colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.jobTagText}>Job {jobSuffix}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Overall rating</Text>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryChipText}>
            Page {currentPage} / {Math.max(totalPages, 1)}
          </Text>
        </View>
      </View>
      <View style={styles.averageRow}>
        <Text style={styles.averageRating}>
          {hasReviews ? averageRating.toFixed(1) : "--"}
        </Text>
        {hasReviews ? renderStars(Math.round(averageRating)) : null}
      </View>
      <Text style={styles.summarySubtext}>
        {loading && !hasReviews
          ? "Fetching your recent reviews..."
          : hasReviews
          ? `${reviews.length} review${
              reviews.length === 1 ? "" : "s"
            } received`
          : "No reviews yet. Keep completing jobs to build trust."}
      </Text>
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.emptyStateLabel}>Loading reviews...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialIcons
          name="rate-review"
          size={48}
          color={colors.textSecondary}
        />
        <Text style={styles.emptyStateTitle}>No reviews to show (yet)</Text>
        <Text style={styles.emptyStateLabel}>
          Once you receive feedback for completed jobs it will appear here.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Reviews</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderReviewCard}
        contentContainerStyle={[
          styles.listContent,
          !hasReviews && !loading ? styles.listEmptyContent : undefined,
        ]}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ReviewListScreen;

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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  listEmptyContent: {
    flexGrow: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryChip: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#E3F2FD",
  },
  summaryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  averageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  averageRating: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 12,
  },
  summarySubtext: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  reviewMetaContainer: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  reviewMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  commentText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  commentPlaceholder: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  jobTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.background,
    marginTop: 14,
  },
  jobTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptyStateLabel: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
