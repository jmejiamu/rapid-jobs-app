import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RequestedJob } from "@/src/types/postjob";
import { MainButton } from "@/src/components";
import { colors } from "@/src/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";

const RequestScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((state: RootState) => state.auth.token);

  const [requestedJobs, setRequestedJobs] = useState<RequestedJob[]>([]);

  const getRequestedJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs/my-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }
      const job = await response.json();
      setRequestedJobs(job.requestedJobs);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  useEffect(() => {
    getRequestedJobs();
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
          Total Requested Jobs: {requestedJobs.length}
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
              {item.title}
            </Text>
            <Text>{item.description}</Text>
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
                onPress={() => {}}
              />
              <MainButton
                style={{ flex: 1, backgroundColor: colors.error }}
                title="Reject"
                onPress={() => {}}
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
