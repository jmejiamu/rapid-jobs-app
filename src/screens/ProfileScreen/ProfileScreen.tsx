import React, { useCallback } from "react";
import { Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootState, persistor } from "@/src/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/src/redux/authSlice";

import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { MainButton } from "@/src/components";
import { PostJobType } from "@/src/types/postjob";
import { usePagination } from "@/src/hooks";
import { colors } from "@/src/theme/colors";
import { styles } from "./styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageBackground } from "expo-image";

const ProfileScreen = () => {
  const { data, loading, loadingMore, fetchData, counts } =
    usePagination<PostJobType>({
      endpoint: "/jobs/my-jobs",
      dataKey: "myJobs",
      paginationKey: "pagination",
      countsKey: "counts",
    });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const username = useSelector((state: RootState) => state.auth.name);
  const phone = useSelector((state: RootState) => state.auth.phone);
  const count = useSelector((state: RootState) => state.count.value);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const isLoggedIn = !!accessToken;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          dispatch(logout());
          await persistor.purge();
          navigation.navigate("Login");
        },
        style: "destructive",
      },
    ]);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!username) return "U";
    const names = username
      .trim()
      .split(" ")
      .filter((name) => name.length > 0);

    if (names.length >= 2) {
      // Nombre + Apellido o más: primera letra de cada uno
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }

    // Un solo nombre: solo la primera letra
    return names[0][0].toUpperCase();
  };

  // Render stats card
  const renderStatsCard = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{data?.length || 0}</Text>
        <Text style={styles.statLabel}>Jobs Posted</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{counts?.jobsDone || 0}</Text>
        <Text style={styles.statLabel}>Jobs Done</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{counts?.reviews || 0}</Text>
        <Text style={styles.statLabel}>Reviews</Text>
      </View>
    </View>
  );

  // Render profile menu items
  const renderMenuItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    title: string,
    onPress: () => void,
    showBadge: boolean = false
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {showBadge && count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <LinearGradient
          colors={["rgba(44, 129, 255, 1)", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,

            height: "60%",
          }}
          pointerEvents="none"
        />
        <View style={[styles.notLoggedInContainer]}>
          <View style={styles.notLoggedInIconContainer}>
            <Image
              source={require("../../../assets/logo-img-no-bg.png")}
              style={{
                width: 350,
                height: 350,
              }}
            />
          </View>
          <Text style={[styles.notLoggedInTitle, { color: "#425065ff" }]}>
            Welcome to{" "}
          </Text>
          <Text style={[styles.notLoggedInTitle, { color: "#316abaff" }]}>
            Rapid Jobs
          </Text>
          <Text style={styles.notLoggedInDescription}>
            Please register or log in to view your profile, post job ads, and
            apply for jobs.
          </Text>
          <View style={styles.notLoggedInButtons}>
            <MainButton
              title="Log In"
              onPress={() => navigation.navigate("Login")}
              size="lg"
              style={styles.loginButton}
            />
            <MainButton
              title="Register"
              // variant="text"
              onPress={() => navigation.navigate("Register")}
              size="lg"
              style={styles.registerButton}
              textStyle={{
                color: "#355e8aff",
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Request")}
            style={styles.notificationIcon}
          >
            <MaterialIcons
              name="notifications-active"
              size={24}
              color={count > 0 ? colors.error : colors.textSecondary}
            />
            {count > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile Info */}
          <ImageBackground
            style={{
              width: "100%",
              marginTop: 30,
              height: 200,
            }}
            source={require("../../../assets/logo-img.png")}
          >
            <View style={styles.profileHeader}>
              <View style={[styles.avatar, { marginTop: 100 }]}>
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              </View>
              <Text style={styles.userName}>{username}</Text>
              <View style={[styles.verifiedContainer]}>
                <Text style={styles.userDetails}>{phone}</Text>
                <MaterialIcons
                  name="verified"
                  size={16}
                  color={colors.success}
                  style={styles.verifiedIcon}
                />
                <Text style={styles.verified}>Verified</Text>
              </View>
            </View>
          </ImageBackground>
          <LinearGradient
            colors={["rgba(111, 167, 251, 0.58)", "transparent"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              // bottom: 0,
              height: 300,
            }}
            pointerEvents="none"
          />

          {/* Stats Cards */}
          {renderStatsCard()}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <MainButton
              title="Post a Job"
              onPress={() => navigation.navigate("PostJob")}
              size="md"
              style={styles.postJobButton}
            />
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Activity</Text>

          {renderMenuItem("work-outline", "My Posted Jobs", () =>
            navigation.navigate("MyPostedJobs")
          )}

          {renderMenuItem(
            "notifications-active",
            "Applications Received",
            () => navigation.navigate("Request"),
            true
          )}

          {renderMenuItem("chat-bubble-outline", "Messages", () =>
            navigation.navigate("MainApp", { screen: "Chat" })
          )}
          {renderMenuItem("list", "Applications Approved", () =>
            navigation.navigate("ApplicationApproved")
          )}
          {renderMenuItem("list-alt", "Review List", () =>
            navigation.navigate("ReviewList")
          )}

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Account Settings</Text>

          {renderMenuItem("person-outline", "Edit Profile", () =>
            Alert.alert(
              "Coming Soon",
              "Edit profile feature will be available soon"
            )
          )}

          {renderMenuItem("settings", "Settings", () =>
            Alert.alert(
              "Coming Soon",
              "Settings feature will be available soon"
            )
          )}

          {renderMenuItem("help-outline", "Help & Support", () =>
            Alert.alert(
              "Coming Soon",
              "Help & Support feature will be available soon"
            )
          )}

          <View style={styles.sectionDivider} />

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <View
                style={[styles.menuIconContainer, styles.logoutIconContainer]}
              >
                <MaterialIcons name="logout" size={22} color={colors.error} />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
