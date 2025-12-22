import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../screens/OnboardingScreen/OnboardingScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { useOnboarding } from "../hooks/useOnboarding";
import PostJobScreen from "../screens/PostJobScreen/PostJobScreen";
import { ChatScreen, LoginScreen, RegistrationScreen } from "../screens";
import RequestScreen from "../screens/RequestScreen/RequestScreen";
import DetailJobScreen from "../screens/DetailJobScreen/DetailJobScreen";
import { PostJobType } from "../types/postjob";
import ChatList from "../screens/ChatList/ChatList";
import { RoomDetails, Rooms } from "../types/Rooms";
import JobPostDetailScreen from "../screens/JobPostDetailScreen/JobPostDetailScreen";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import MyPostedJobsScreen from "../screens/MyPostedJobsScreen/MyPostedJobsScreen";
import ApplicationApproved from "../screens/ApplicationApproved/ApplicationApproved";

export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
  PostJob: { job?: PostJobType } | undefined;
  Register: undefined;
  Login: undefined;
  Request: undefined;
  ChatList: undefined;
  DetailJob: { job: PostJobType };
  ChatDetail: { job: RoomDetails };
  JobPostDetail: { job: PostJobType };
  MyPostedJobs: undefined;
  ApplicationApproved: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isOnboardingComplete, setOnboardingComplete } = useOnboarding();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {!accessToken && !isOnboardingComplete ? (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onComplete={handleOnboardingComplete}
            />
          )}
        </Stack.Screen>
      ) : null}
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Request" component={RequestScreen} />
      <Stack.Screen name="DetailJob" component={DetailJobScreen} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatDetail" component={ChatScreen} />
      <Stack.Screen name="JobPostDetail" component={JobPostDetailScreen} />
      <Stack.Screen name="MyPostedJobs" component={MyPostedJobsScreen} />
      <Stack.Screen
        name="ApplicationApproved"
        component={ApplicationApproved}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
