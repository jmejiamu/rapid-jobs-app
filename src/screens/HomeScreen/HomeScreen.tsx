import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";

import { JobCard } from "@/src/components/JobCard";
import { MainButton } from "@/src/components/MainButton";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { API_SOCKET_URL } from "@/config/api";
import { usePagination } from "@/src/hooks";
import { PostJobType } from "@/src/types/postjob";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { AppDispatch, persistor, RootState } from "@/src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/redux/authSlice";

const HomeScreen: React.FC = () => {
  const {
    data: jobs,
    loading,
    loadingMore,
    currentPage,
    totalPages,
    fetchData,
    resetData,
    addNewItem,
  } = usePagination<PostJobType>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filters = ["All", "Cleaning", "Gardening", "Painting"];

  // Debounced fetchData when searchQuery changes
  useEffect(() => {
    resetData();
    const handler = setTimeout(() => {
      fetchData(1, searchQuery);
    }, 350); // 350ms debounce
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, fetchData, resetData]);

  useEffect(() => {
    const socket = io(API_SOCKET_URL);

    socket.on("jobCreated", (newJob) => {
      addNewItem(newJob);
    });

    return () => {
      socket.off("jobCreated");
      socket.disconnect();
    };
  }, [addNewItem]);

  // Logout handler
  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Add Logout Button in Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rapid Jobs</Text>
        {token && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter By */}
        <Text style={styles.filterLabel}>Filter by</Text>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextSelected,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Job List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={({ item }) => {
            return (
              <>
                <JobCard job={item} />
                <View style={styles.jobActions}>
                  <View style={styles.seeDetailsButton}>
                    <MainButton
                      title="See details"
                      onPress={() => {}}
                      style={styles.primaryButton}
                    />
                  </View>
                  <View style={styles.doJobButton}>
                    <MainButton
                      title="Do this job"
                      onPress={() => {}}
                      style={styles.secondaryButton}
                    />
                  </View>
                </View>
              </>
            );
          }}
          keyExtractor={(item, index) => item._id + index.toString()}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (currentPage < totalPages && !loadingMore) {
              fetchData(currentPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  logoutButton: {
    padding: 5,
  },
  searchContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.textSecondary + "30",
  },
  filterLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 10,
  },
  filterScroll: {
    marginBottom: 5,
  },
  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonSelected: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  filterButtonTextSelected: {
    color: colors.surface,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListContent: {
    padding: 16,
  },
  jobActions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  seeDetailsButton: {},
  primaryButton: {
    backgroundColor: colors.primary,
  },
  doJobButton: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: colors.textSecondary,
  },
  footerLoader: {
    padding: 16,
    alignItems: "center",
  },
});
