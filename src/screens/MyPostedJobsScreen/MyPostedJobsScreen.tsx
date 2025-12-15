import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { EmptyState, JobCard, MainButton } from "@/src/components";
import { styles } from "../ProfileScreen/styles/styles";
import { PostJobType } from "@/src/types/postjob";
import { fontSize } from "@/src/theme/fontStyle";
import { RootState } from "@/src/redux/store";
import { usePagination } from "@/src/hooks";
import { colors } from "@/src/theme/colors";

const MyPostedJobsScreen = () => {
  const { data, loading, loadingMore, currentPage, totalPages, fetchData } =
    usePagination<PostJobType>({
      endpoint: "/jobs/my-jobs",
      dataKey: "myJobs",
      paginationKey: "pagination",
    });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const isLoggedIn = !!accessToken;

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
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 16, flex: 1 }}>
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
            contentContainerStyle={
              data?.length === 0 ? styles?.emptyListContainer : undefined
            }
            ListEmptyComponent={
              <EmptyState
                icon="briefcase-outline"
                title="You haven't posted any jobs yet"
                description="Create your first job post and start finding workers for your projects"
              />
            }
            ListHeaderComponent={
              <>
                {data?.length > 0 && (
                  <Text style={styles.headerText}>My Posted Jobs</Text>
                )}
              </>
            }
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

export default MyPostedJobsScreen;
