import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API_SOCKET_URL, API_URL } from "@/config/api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RequestedJob } from "@/src/types/postjob";
import { EmptyState, MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { MaterialIcons } from "@expo/vector-icons";
import io from "socket.io-client";
import { apiFetch } from "@/src/utils/apiFetch";

const RequestScreen = () => {
  const socket = io(API_SOCKET_URL);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [requestedJobs, setRequestedJobs] = useState<RequestedJob[]>([]);

  const getRequestedJobs = async () => {
    try {
      const response = await apiFetch(`/jobs/my-requests`, {
        method: "GET",
      });
      const job = await response?.json();
      setRequestedJobs(job.requestedJobs);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const rejectJob = async (jobId: string, requestId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/jobs/reject-request/${jobId}/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const job = await response.json();
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const approveJob = async (jobId: string, requestId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/jobs/approve-request/${jobId}/${requestId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const job = await response.json();
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  useEffect(() => {
    getRequestedJobs();
  }, []);

  useEffect(() => {
    socket.on("requestRejected", (data) => {
      const { request } = data;
      setRequestedJobs((prevRequests) =>
        prevRequests.filter(
          (r) => r._id !== request._id && r.jobId._id !== request.jobId
        )
      );
    });

    socket.on("requestApproved", (data) => {
      const { request } = data;
      getRequestedJobs();
    });

    return () => {
      socket.off("requestRejected");
      socket.disconnect();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const renderRequestCard = ({ item }: { item: RequestedJob }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {item.jobId.title}
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
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.jobId.description}
      </Text>

      <View style={styles.requesterInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userId.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.requesterDetails}>
          <Text style={styles.requesterName}>{item.userId.name}</Text>
          <Text style={styles.requesterAction}>wants to do this job</Text>
        </View>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionButtons}>
          <MainButton
            style={styles.acceptButton}
            title="Accept"
            onPress={() => approveJob(item.jobId._id, item._id)}
          />
          <MainButton
            style={styles.rejectButton}
            title="Reject"
            onPress={() => rejectJob(item.jobId._id, item._id)}
          />
        </View>
      )}
    </View>
  );

  const renderListHeader = () => (
    <>
      {requestedJobs?.length > 0 && (
        <Text style={styles.listHeaderText}>Job Requests</Text>
      )}
    </>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="inbox-outline"
      title="No Requests Yet"
      description="When someone wants to do one of your jobs, their request will appear here."
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentWrapper}>
        <FlatList
          data={requestedJobs}
          keyExtractor={(item, index) => item.userId._id.toString() + index}
          renderItem={renderRequestCard}
          contentContainerStyle={
            requestedJobs?.length === 0 ? styles.emptyListContent : undefined
          }
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default RequestScreen;

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
  jobTitle: {
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
  jobDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  requesterInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.surface,
  },
  requesterDetails: {
    marginLeft: 12,
  },
  requesterName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  requesterAction: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.error,
  },
});
