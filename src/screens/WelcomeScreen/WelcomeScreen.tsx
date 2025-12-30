import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { MainButton } from "@/src/components";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/navigation/RootNavigator";

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{
            width: 500,
            height: 500,
            alignSelf: "center",
            marginTop: -100,
          }}
          source={require("../../../assets/logo-img.png")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Rapid Jobs</Text>
          <Text style={styles.subtitle}>Find jobs fast — apply in seconds</Text>
        </View>
      </View>

      <MainButton
        title="Continue"
        onPress={() => navigation.navigate("Onboarding")}
        size="lg"
        style={{
          marginHorizontal: 20,
          marginTop: 20,
          backgroundColor: "blue",
          borderRadius: 25,
        }}
      />
      <LinearGradient
        // colors={["rgba(0,0,0,0.8)", "transparent"]}
        colors={["rgba(111, 167, 251, 0.58)", "transparent"]}
        style={styles.background}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        pointerEvents="none"
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    // top: 0,
    bottom: 0,
    height: 300,
  },
  textContainer: {
    alignItems: "center",
    position: "absolute",
    top: 450,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0B2F6F",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#4B5563",
  },
});
