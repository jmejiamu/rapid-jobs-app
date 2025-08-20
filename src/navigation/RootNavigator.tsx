import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../screens/OnboardingScreen/OnboardingScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { useOnboarding } from "../hooks/useOnboarding";
import PostJobScreen from "../screens/PostJobScreen/PostJobScreen";
import { LoginScreen, RegistrationScreen } from "../screens";

export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
  PostJob: undefined;
  Register: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isOnboardingComplete, setOnboardingComplete } = useOnboarding();

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
      {!isOnboardingComplete ? (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onComplete={handleOnboardingComplete}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="Register" component={RegistrationScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
