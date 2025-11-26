import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { API_URL } from "@/config/api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import { Rooms } from "@/src/types/Rooms";
import { MainButton } from "@/src/components";

const ChatList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const [chatRooms, setChatRooms] = useState<Rooms[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChatRooms = useCallback(
    async (isRefreshing = false) => {
      if (!token) return;

      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(`${API_URL}/chat/rooms`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Unable to load your conversations right now.");
        }

        const data: { rooms?: Rooms[] } = await response.json();
        setChatRooms(data.rooms ?? []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        if (isRefreshing) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [token]
  );

  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, [fetchChatRooms])
  );

  const handleRefresh = useCallback(() => {
    fetchChatRooms(true);
  }, [fetchChatRooms]);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const renderEmptyState = () => (
    <View style={styles.stateContainer}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : error ? (
        <>
          <Ionicons
            name="warning-outline"
            size={42}
            color={colors.warning}
            style={styles.stateIcon}
          />
          <Text style={styles.stateTitle}>We couldn't load your chats.</Text>
          <Text style={styles.stateSubtitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <AntDesign
            name="message"
            size={42}
            color={colors.textSecondary}
            style={styles.stateIcon}
          />
          <Text style={styles.stateTitle}>No conversations yet</Text>
          <Text style={styles.stateSubtitle}>
            Start a chat from a job detail to see it listed here.
          </Text>
        </>
      )}
    </View>
  );

  if (!token) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
              Please log in to view your conversations.
            </Text>
          </View>
          <View style={styles.stateContainer}>
            <AntDesign
              name="user"
              size={42}
              color={colors.textSecondary}
              style={styles.stateIcon}
            />
            <Text style={styles.stateTitle}>You're not logged in</Text>
            <Text style={styles.stateSubtitle}>
              Log in or register to start chatting.
            </Text>
            <View style={styles.buttonContainer}>
              <MainButton
                title="Log In"
                onPress={() => navigation.navigate("Login")}
              />

              <MainButton
                title="Register"
                variant="secondary"
                onPress={() => navigation.navigate("Register")}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>
            Stay connected with applicants and clients.
          </Text>
        </View>

        <FlatList
          data={chatRooms}
          keyExtractor={(item, index) => `${item.jobId}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                navigation.navigate("ChatDetail", {
                  job: {
                    jobId: item.jobId,
                    otherUserId: item.otherUserId,
                  },
                });
              }}
            >
              <View style={styles.card}>
                <View style={styles.avatar}>
                  <AntDesign name="wechat" size={24} color="white" />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>
                      {item.jobTitle || "Conversation"}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(item.timestamp)}
                    </Text>
                  </View>

                  <Text numberOfLines={2} style={styles.preview}>
                    {item.lastMessageSenderId === userId ? "You: " : "Other: "}
                    {item.lastMessage || "Tap to start the conversation."}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={[
            styles.listContent,
            chatRooms.length === 0 && styles.emptyListContent,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  header: {
    paddingVertical: 24,
    gap: 6,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 12,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  cardSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  preview: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  separator: {
    height: 16,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  stateIcon: {
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  stateSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  loginButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "white",
  },
  registerButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
  },
});
