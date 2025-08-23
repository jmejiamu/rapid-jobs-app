import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { colors } from "@/src/theme/colors";
import { fontSize } from "@/src/theme/fontStyle";

const ChatScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
        <Text style={{
          fontSize: fontSize.xl,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 10,
          textAlign: "center",
        }}>
          Chat
        </Text>
        
        <Text style={{
          fontSize: fontSize.md,
          color: colors.textSecondary,
          textAlign: "center",
        }}>
          Your conversations will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;