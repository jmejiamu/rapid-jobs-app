import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./RootNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { OnboardingProvider } from "../hooks/useOnboarding";

export default function AppNavigator() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <OnboardingProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </OnboardingProvider>
      </PersistGate>
    </Provider>
  );
}
