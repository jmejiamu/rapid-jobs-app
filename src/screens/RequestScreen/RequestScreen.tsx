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
import { MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
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
      const job = await response.json();
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

  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Total Requested Jobs: {requestedJobs?.length ?? 0}
        </Text>
      </View>
      <FlatList
        data={requestedJobs}
        keyExtractor={(item, index) => item.userId._id.toString() + index}
        renderItem={({ item }) => (
          <View
            style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ccc" }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.jobId.title}
            </Text>
            <Text>{item.jobId.description}</Text>
            <Text key={item.userId._id} style={{ marginBottom: 8 }}>
              {item.userId.name} want to do this job - Status: {item.status}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
                marginTop: 10,
              }}
            >
              <MainButton
                style={{ flex: 1 }}
                title="Accept"
                onPress={() => approveJob(item.jobId._id, item._id)}
              />
              <MainButton
                style={{ flex: 1, backgroundColor: colors.error }}
                title="Reject"
                onPress={() => rejectJob(item.jobId._id, item._id)}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({});
