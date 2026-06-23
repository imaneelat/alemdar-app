// src/services/notificationService.ts
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// Configure foreground notifications
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner:true,
      shouldShowList: true;
    }),
  });
}

// Token registration setup
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("marketing", {
      name: "Reminders & Updates",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.error("Permission not granted for push notifications.");
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    console.error("Project ID missing from app configuration.");
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    // Send token to backend here
    return pushTokenString;
  } catch (error) {
    console.error(`Token retrieval failed: ${error}`);
  }
}
