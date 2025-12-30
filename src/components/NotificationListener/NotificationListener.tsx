import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as Notifications from "expo-notifications";
import { AppDispatch } from "@/src/redux/store";
import {
  fetchExpoPushToken,
  setNotification,
} from "@/src/redux/notificationSlice";

interface NotificationListenerProps {
  children: React.ReactNode;
}

//Foreground Notification behavior - https://docs.expo.dev/push-notifications/receiving-notifications/
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationListener = (props: NotificationListenerProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchExpoPushToken());

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [dispatch]);
  return <>{props.children}</>;
};
