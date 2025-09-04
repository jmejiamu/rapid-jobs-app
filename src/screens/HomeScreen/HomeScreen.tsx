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

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.background,
        }}
      >
        {/* Search Input */}
        <TextInput
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: fontSize.sm,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: colors.textSecondary + "30",
          }}
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter By */}
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textPrimary,
            marginTop: 15,
            marginBottom: 10,
          }}
        >
          Filter by
        </Text>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 5 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={{
                backgroundColor:
                  selectedFilter === filter ? colors.primary : colors.surface,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color:
                    selectedFilter === filter
                      ? colors.surface
                      : colors.textPrimary,
                  fontWeight: selectedFilter === filter ? "600" : "400",
                }}
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
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    gap: 10,
                  }}
                >
                  <View style={{}}>
                    <MainButton
                      title="See details"
                      onPress={() => {}}
                      style={{ backgroundColor: colors.primary }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <MainButton
                      title="Do this job"
                      onPress={() => {}}
                      style={{ backgroundColor: colors.textSecondary }}
                    />
                  </View>
                </View>
              </>
            );
          }}
          keyExtractor={(item, index) => item._id + index.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (currentPage < totalPages && !loadingMore) {
              fetchData(currentPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ padding: 16, alignItems: "center" }}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
