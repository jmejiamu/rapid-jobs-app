import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MainButton } from "@/src/components";
import { styles } from "./styles/styles";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/src/navigation/RootNavigator";

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginHorizontal: 16 }}>
        <View style={styles.rowContainer}>
          <View style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.userName}>User name</Text>
            <Text style={styles.userDetails}>
              +1503 245 6772 <Text style={styles.verified}>| verified</Text>
            </Text>
          </View>
        </View>

        <MainButton
          title="Post a job"
          onPress={() => navigation.navigate("PostJob")}
          size="md"
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
