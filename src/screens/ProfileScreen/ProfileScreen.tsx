import React, { useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { JobCard, MainButton } from "@/src/components";
import { PostJobType } from "@/src/types/postjob";
import { colors } from "@/src/theme/colors";
import { styles } from "./styles/styles";
import { API_URL } from "@/config/api";
import { fontSize } from "@/src/theme/fontStyle";

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const token = useSelector((state: RootState) => state.auth.token);

  const [jobs, setJobs] = useState<PostJobType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // TODO: use this for the home screen
      // const response = await fetch(`${API_URL}/jobs/retrieve-jobs`);
      const response = await fetch(`${API_URL}/jobs/my-jobs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setJobs(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
          },
        ]}
      >
        <View style={{ marginHorizontal: 16 }}>
          <Text style={{ textAlign: "center", fontSize: fontSize.xl }}>
            Please register or log in to view your profile, post job ads, and
            apply for jobs.
          </Text>
          <MainButton
            title="Register"
            variant="text"
            onPress={() => navigation.navigate("Register")}
            size="md"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginHorizontal: 16, flex: 1 }}>
        <View style={styles.rowContainer}>
          <View style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.userName}>User name</Text>
            <Text style={styles.userDetails}>
              +1503 245 6772 <Text style={styles.verified}>| verified</Text>
            </Text>
          </View>
        </View>

        <MainButton
          title="Post a job"
          onPress={() => navigation.navigate("PostJob")}
          size="md"
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.textPrimary} />
          </View>
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item, idx) => item?._id + idx.toString()}
            renderItem={({ item }) => <JobCard job={item} />}
            ListEmptyComponent={<Text>No jobs found.</Text>}
            ListHeaderComponent={
              <>
                {jobs.length > 0 && (
                  <Text style={styles.headerText}>My Posted Jobs</Text>
                )}
              </>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
