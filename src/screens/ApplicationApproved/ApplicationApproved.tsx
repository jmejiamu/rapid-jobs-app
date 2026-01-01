import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "@/config/api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { usePagination } from "@/src/hooks";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import {
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { EmptyState } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";

type userType = {
  _id: string;
  name: string;
};

type Job = {
  _id: string;
  title: string;
  pay: string;
  address: string;
  description: string;
  images: string[];
  category: string;
  userId: userType;
  status: "approved" | "completed" | string;
  postedAt?: string;
  __v?: number;
  assignedTo?: userType;
  isOwner?: boolean;
  isAssignee?: boolean;
  canComplete?: boolean;
  [key: string]: any;
  canReview?: boolean;
  hasCurrentUserReviewed?: boolean;
};

const ApplicationApproved = () => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const { data, loading, loadingMore, currentPage, totalPages, fetchData } =
    usePagination<Job>({
      endpoint: "/jobs/approved-jobs",
      dataKey: "myApprovedJobs",
      paginationKey: "pagination",
    });

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const markComplete = async (jobId: string) => {
    Alert.alert(
      "Confirm",
      "Mark this job as complete?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setMarkingId(jobId);
              const res = await fetch(`${API_URL}/jobs/complete-job/${jobId}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Failed to mark complete");
              }
              Alert.alert("Success", "Job marked as complete");
              fetchData();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Something went wrong");
            } finally {
              setMarkingId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const leaveReview = (jobId: string, owner: userType, assignee: userType) => {
    navigation.navigate("Review", {
      jobId: jobId,
      owner: {
        id: owner._id,
        name: owner.name,
      },
      assignee: {
        id: assignee._id,
        name: assignee.name,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "approved":
        return colors.primary;
      default:
        return colors.warning;
    }
  };

  const renderItem = ({ item }: { item: Job }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.payRow}>
          <MaterialIcons name="attach-money" size={18} color={colors.success} />
          <Text style={styles.pay}>{item.pay}</Text>
        </View>

        {item.address ? (
          <View style={styles.addressRow}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.address}>{item.address}</Text>
          </View>
        ) : null}

        <Text style={styles.desc} numberOfLines={3}>
          {item.description}
        </Text>

        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : null}

        {item.assignedTo && (
          <View style={styles.assignedInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.assignedTo.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.assignedDetails}>
              <Text style={styles.assignedLabel}>Assigned to</Text>
              <Text style={styles.assignedName}>
                {item.assignedTo._id === userId ? "Me" : item.assignedTo.name}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.posted}>
            {item.postedAt
              ? new Date(item.postedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </Text>

          <View style={styles.actionButtons}>
            {item.isOwner && item.canComplete && item.status !== "completed" ? (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => markComplete(item._id)}
                disabled={markingId === item._id}
              >
                {markingId === item._id ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={16} color="#fff" />
                    <Text style={styles.completeText}>Complete</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : null}

            {item.status === "completed" ? (
              <TouchableOpacity
                style={[
                  styles.reviewBtn,
                  !item.canReview && styles.reviewBtnDisabled,
                ]}
                disabled={!item.canReview}
                onPress={() =>
                  leaveReview(item._id, item.userId, item.assignedTo!)
                }
              >
                <MaterialIcons
                  name={item.hasCurrentUserReviewed ? "star" : "star-outline"}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.reviewText}>
                  {item.hasCurrentUserReviewed ? "Reviewed" : "Review"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  const renderListHeader = () => (
    <>
      {data?.length > 0 && (
        <Text style={styles.listHeaderText}>Approved Applications</Text>
      )}
    </>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="clipboard-check-outline"
      title="No Approved Applications"
      description="Jobs you've been approved for or jobs where you've approved someone will appear here."
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrapper}>
        <FlatList
          data={data}
          keyExtractor={(item: Job) => item._id}
          renderItem={renderItem}
          contentContainerStyle={
            data?.length === 0 ? styles.emptyListContent : undefined
          }
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          onEndReached={() => {
            if (!loadingMore && currentPage < totalPages) {
              fetchData(currentPage + 1);
            }
          }}
          onRefresh={() => fetchData(1)}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.textPrimary} />
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ApplicationApproved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
  },
  contentWrapper: {
    marginHorizontal: 16,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeaderText: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: fontSize.xxs,
    fontWeight: "600",
  },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pay: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.success,
    marginLeft: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  address: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  desc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  assignedInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.surface,
  },
  assignedDetails: {
    marginLeft: 12,
  },
  assignedLabel: {
    fontSize: fontSize.xxs,
    color: colors.textSecondary,
  },
  assignedName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  posted: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  completeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  completeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: fontSize.xs,
  },
  reviewBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewBtnDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
  reviewText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: fontSize.xs,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
