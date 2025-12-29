import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import { NotificationListener } from "../components/NotificationListener/NotificationListener";
import { OnboardingProvider } from "../hooks/useOnboarding";
import { store, persistor } from "../redux/store";
import RootNavigator from "./RootNavigator";

export default function AppNavigator() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NotificationListener>
          <OnboardingProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </OnboardingProvider>
        </NotificationListener>
      </PersistGate>
    </Provider>
  );
}
