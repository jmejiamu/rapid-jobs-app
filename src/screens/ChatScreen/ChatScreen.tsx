import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import io from "socket.io-client";
import { SafeAreaView } from "react-native-safe-area-context";

import { fontSize } from "@/src/theme/fontStyle";
import { colors } from "@/src/theme/colors";
import { API_SOCKET_URL, API_URL } from "@/config/api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "@/src/navigation/RootNavigator";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

type DetailJobRouteProp = RouteProp<RootStackParamList, "ChatDetail">;

const ChatScreen: React.FC = () => {
  const socket = io(API_SOCKET_URL);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const userId = useSelector((state: RootState) => state.auth.userId); // Replace with actual user ID from auth context or redux
  const route = useRoute<DetailJobRouteProp>();
  const { job } = route.params ?? {};

  const token = useSelector((state: RootState) => state.auth.token);

  const [messages, setMessages] = useState("");
  const [newMessage, setNewMessage] = useState<
    {
      jobId: string;
      senderId: string;
      receiverId: string;
      message: string;
      timestamp: string;
    }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!messages.trim()) return;
    if (!job?.jobId || !job?.otherUserId) return;

    try {
      const payload = {
        jobId: job.jobId,
        receiverId: job.otherUserId,
        message: messages.trim(),
      };
      const response = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessages("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchChatHistory = async () => {
    if (!job?.jobId || !job?.otherUserId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/chat/history/${job.jobId}/${job.otherUserId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Unable to load messages. Please try again.");
      }

      const data = await res.json();
      setNewMessage(data);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching messages."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!job?.jobId || !userId) return;

    socket.emit("joinRoom", { roomId: job.jobId, userId });

    socket.on("newMessage", (newMessage) => {
      if (typeof newMessage === "object" && newMessage !== null) {
        setNewMessage((prev) => [...prev, newMessage]);
      } else {
        console.error("Invalid incoming message:", newMessage);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [job?.jobId, userId]);

  useEffect(() => {
    fetchChatHistory();
  }, [job?.jobId]);

  const formatTimestamp = useCallback((timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";

    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return formatter.format(date);
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: (typeof newMessage)[number] }) => {
      const isOwn = item.senderId === userId;
      const messageText =
        typeof item.message === "string" ? item.message : "Invalid message";
      const timestampText = formatTimestamp(item.timestamp);
      return (
        <View
          style={[
            styles.messageRow,
            isOwn ? styles.alignEnd : styles.alignStart,
          ]}
        >
          <View
            style={[
              styles.bubble,
              isOwn ? styles.ownBubble : styles.otherBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isOwn ? styles.ownMessageText : undefined,
              ]}
            >
              {messageText}
            </Text>
            <Text style={isOwn ? { color: "white" } : styles.timestampText}>
              {timestampText}
            </Text>
          </View>
        </View>
      );
    },
    [formatTimestamp, userId]
  );

  const listEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Loading conversation...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Ionicons name="warning-outline" size={32} color={colors.warning} />
          <Text style={styles.stateText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <AntDesign name="message" size={32} color={colors.textSecondary} />
        <Text style={styles.stateText}>
          No messages yet. Say hello to start the conversation!
        </Text>
      </View>
    );
  }, [error, loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={{}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={32}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={newMessage}
          keyExtractor={(item, index) =>
            `${item.jobId}-${item.senderId}-${index}`
          }
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={listEmptyComponent}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={messages}
            onChangeText={setMessages}
            placeholder="Type your message"
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              !messages.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!messages.trim()}
          >
            <FontAwesome
              name="send"
              size={20}
              color={messages.trim() ? "white" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  flex: {
    flex: 1,
  },

  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  messageRow: {
    flexDirection: "row",
  },
  alignStart: {
    justifyContent: "flex-start",
  },
  alignEnd: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  otherBubble: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary + "22",
  },
  ownBubble: {
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  ownMessageText: {
    color: colors.surface,
  },
  timestampText: {
    fontSize: fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  stateText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.textSecondary + "22",
    backgroundColor: colors.surface,
    gap: 12,
  },
  textInput: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textSecondary + "44",
  },
});
