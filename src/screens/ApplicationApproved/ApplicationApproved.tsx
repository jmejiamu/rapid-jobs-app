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

type userType = {
  _id: string;
  name: string;
};
// Add Job type that matches backend response
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const { data, loading, loadingMore, currentPage, totalPages, fetchData } =
    usePagination<Job>({
      endpoint: "/jobs/approved-jobs",
      dataKey: "myApprovedJobs", // key has to match backend response
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

  // show review flow (replace Alert with modal/navigation if you have a review screen)
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

  const renderItem = ({ item }: { item: Job }) => {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.pay}>${item.pay}</Text>
        </View>

        <Text style={styles.sub}>{item.address}</Text>
        <Text style={styles.desc} numberOfLines={3}>
          {item.description}
        </Text>

        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : null}

        <View style={styles.row}>
          <Text style={styles.posted}>
            {item.postedAt ? new Date(item.postedAt).toLocaleString() : ""}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Owner can mark complete (only when job is not completed) */}
            {item.isOwner && item.canComplete && item.status !== "completed" ? (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => markComplete(item._id)}
                disabled={markingId === item._id}
              >
                {markingId === item._id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.completeText}>Mark Complete</Text>
                )}
              </TouchableOpacity>
            ) : null}

            {/* Once completed, show Leave Review to both users */}
            {item.status === "completed" ? (
              <TouchableOpacity
                style={[
                  styles.reviewBtn,
                  { marginLeft: 8 },
                  !item.canReview && styles.canReview,
                ]}
                disabled={!item.canReview}
                onPress={() =>
                  leaveReview(item._id, item.userId, item.assignedTo!)
                }
              >
                <Text style={styles.reviewText}>
                  {item.hasCurrentUserReviewed ? "Reviewed" : "Leave Review"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.screenTitle}>Approved Applications</Text>
      <FlatList
        data={data}
        keyExtractor={(item: Job) => item._id}
        renderItem={renderItem}
        onEndReached={() => {
          if (!loadingMore && currentPage < totalPages) {
            fetchData(currentPage + 1);
          }
        }}
        onRefresh={() => fetchData(1)}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No approved applications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ApplicationApproved;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  pay: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2b8a3e",
  },
  sub: {
    color: "#666",
    marginTop: 4,
  },
  desc: {
    marginTop: 8,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 160,
    marginTop: 8,
    borderRadius: 6,
  },
  posted: {
    color: "#999",
    fontSize: 12,
  },
  completeBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  completeText: {
    color: "#fff",
    fontWeight: "600",
  },
  reviewBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  reviewText: {
    color: "#fff",
    fontWeight: "600",
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  canReview: {
    backgroundColor: "#da9999ff",
  },
});
