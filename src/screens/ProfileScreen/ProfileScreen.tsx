import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import { fontSize } from "@/src/theme/fontStyle";
import { usePagination } from "@/src/hooks";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const { data, loading, loadingMore, currentPage, totalPages, fetchData } =
    usePagination<PostJobType>({
      endpoint: "/jobs/my-jobs",
      dataKey: "myJobs",
      paginationKey: "pagination",
    });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.name);
  const phone = useSelector((state: RootState) => state.auth.phone);
  const count = useSelector((state: RootState) => state.count.value);

  useFocusEffect(
    useCallback(() => {
      fetchData();
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Request")}
          style={styles.notificationIcon}
        >
          <MaterialIcons
            name="notifications-active"
            size={24}
            color={count > 0 ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <View style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.userName}>{username}</Text>
            <Text style={styles.userDetails}>
              {phone} <Text style={styles.verified}>| verified</Text>
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
            data={data}
            keyExtractor={(item, idx) => item?._id + idx.toString()}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate("JobPostDetail", { job: item })
                  }
                >
                  <JobCard job={item} />
                </Pressable>
              );
            }}
            ListEmptyComponent={<Text>No jobs found.</Text>}
            ListHeaderComponent={
              <>
                {data?.length > 0 && (
                  <Text style={styles.headerText}>My Posted Jobs</Text>
                )}
              </>
            }
            // Pagination: fetch more data when reaching end
            onEndReached={() => {
              if (!loadingMore && currentPage < totalPages) {
                fetchData(currentPage + 1);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
