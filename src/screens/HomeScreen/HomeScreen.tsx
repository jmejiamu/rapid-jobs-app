import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { JobCard } from "@/src/components/JobCard";
import { MainButton } from "@/src/components/MainButton";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { PostJobType } from "@/src/types/postjob";

// Mock data for demonstration
const mockJobs: PostJobType[] = [
  {
    title: "Clean Back yard",
    pay: "15",
    description: "Need someone to clean the back yard, remove weeds and organize garden tools",
    address: "San Salvador, 14 ave",
    postedAt: new Date(),
    _id: "1",
  },
  {
    title: "Clean Back yard",
    pay: "15", 
    description: "Need someone to clean the back yard, remove weeds and organize garden tools",
    address: "San Salvador, 14 ave",
    postedAt: new Date(),
    _id: "2",
  },
  {
    title: "Clean Back yard",
    pay: "15",
    description: "Need someone to clean the back yard, remove weeds and organize garden tools", 
    address: "San Salvador, 14 ave",
    postedAt: new Date(),
    _id: "3",
  },
];

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Cleaning", "Gardening", "Painting"];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "All" || 
                         job.title.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={{
        backgroundColor: colors.surface,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
      }}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}>
          <Text style={{
            fontSize: fontSize.md,
            color: colors.textPrimary,
            fontWeight: "500",
          }}>
            home/ feed
          </Text>
          <TouchableOpacity>
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: colors.background,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "bold" }}>💬</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          style={{
            backgroundColor: colors.background,
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
        <Text style={{
          fontSize: fontSize.sm,
          color: colors.textPrimary,
          marginTop: 15,
          marginBottom: 10,
        }}>
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
                backgroundColor: selectedFilter === filter ? colors.primary : colors.background,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 10,
              }}
            >
              <Text style={{
                fontSize: fontSize.sm,
                color: selectedFilter === filter ? colors.surface : colors.textPrimary,
                fontWeight: selectedFilter === filter ? "600" : "400",
              }}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job List */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.map((job, index) => (
          <View key={job._id || index} style={{ marginBottom: 15 }}>
            <JobCard job={job} />
            <View style={{
              flexDirection: "row",
              marginTop: 10,
              gap: 10,
            }}>
              <TouchableOpacity style={{
                backgroundColor: colors.textSecondary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                flex: 1,
              }}>
                <Text style={{
                  color: colors.surface,
                  fontSize: fontSize.sm,
                  fontWeight: "500",
                  textAlign: "center",
                }}>
                  See details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                flex: 1,
              }}>
                <Text style={{
                  color: colors.surface,
                  fontSize: fontSize.sm,
                  fontWeight: "500",
                  textAlign: "center",
                }}>
                  Do this job
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
