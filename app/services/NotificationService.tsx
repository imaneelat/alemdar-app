// app/notification-test.tsx
import { useEffect, useRef, useState } from "react";
import { Text, View, Button } from "react-native";
import * as Notifications from "expo-notifications";
import type { EventSubscription } from "expo-modules-core";

// 1. Import your existing service functions directly
import {
  configureNotifications,
  registerForPushNotificationsAsync,
} from "./notificationService";

// Execute your setup utility
configureNotifications();

// Independent trigger script for local testing
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "🛒 Cart Abandoned!",
    body: "You left items in your cart! Tap to check out now.",
    data: { screen: "Cart", cartId: "4321" },
  };

  await fetch("https://exp.host", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function NotificationTesterScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    // 2. Reuse your existing token function & assign it to visual layout state
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((incomingNotification) => {
        console.log("Foreground Notification Recieved:", incomingNotification);
        setNotification(incomingNotification); // Push data to screen state
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("User tapped notification with data:", data);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        padding: 25,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>
          Your Expo Push Token:
        </Text>
        <Text
          selectable
          style={{
            fontSize: 12,
            color: "#666",
            textAlign: "center",
            paddingHorizontal: 10,
          }}
        >
          {expoPushToken || "Fetching token..."}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 10, color: "#333" }}>
          Live Notification Stream:
        </Text>
        <Text>
          <Text style={{ fontWeight: "600" }}>Title:</Text>{" "}
          {notification?.request.content.title || "None"}
        </Text>
        <Text>
          <Text style={{ fontWeight: "600" }}>Body:</Text>{" "}
          {notification?.request.content.body || "None"}
        </Text>
        <Text style={{ marginTop: 5, fontSize: 12, color: "#777" }}>
          <Text style={{ fontWeight: "600" }}>Data Payload:</Text>{" "}
          {notification
            ? JSON.stringify(notification.request.content.data)
            : "{}"}
        </Text>
      </View>

      <Button
        title="Trigger Test Notification"
        disabled={!expoPushToken}
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
