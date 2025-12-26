import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import HomeScreen from "../screens/HomeScreen/HomeScreen";
import { ProfileScreen } from "../screens";
import { colors } from "../theme/colors";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ChatList from "../screens/ChatList/ChatList";

export type BottomTabParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const count = useSelector((state: RootState) => state.count.value);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof FontAwesome.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Chat") {
            iconName = focused ? "comments" : "comments-o";
          } else if (route.name === "Profile") {
            iconName = focused ? "user" : "user-o";
          } else {
            iconName = "question-circle-o";
          }

          return <FontAwesome name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5EA",
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: 20,
          height: 84,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatList}
        options={{
          tabBarLabel: "Chat",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
