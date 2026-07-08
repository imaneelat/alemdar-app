import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const AMBER = "#FF6B00";

type NotificationItem = {
  id: string;
  image: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    image: "",
    title: "Order Shipped",
    message: "Your order #1042 has been shipped and is on its way.",
    time: "48min ago",
    read: false,
  },
  {
    id: "2",
    image: "",
    title: "Weekend Sale",
    message: "20% off all Arduino boards this weekend only.",
    time: "5h ago",
    read: false,
  },
  {
    id: "3",
    image: "",
    title: "Order Delivered",
    message: "Your order #1038 was delivered successfully.",
    time: "1d ago",
    read: true,
  },
  {
    id: "4",
    image: "",
    title: "Repair Update",
    message: "Your repair request has been received. We'll call you shortly.",
    time: "10d ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notifications, setNotifications] = useState(mockNotifications);

  const bg = isDark ? "#000000" : "#ffffff";
  const text = isDark ? "#ffffff" : "#111111";
  const subtext = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const unreadBg = isDark ? "rgba(245,166,35,0.06)" : "rgba(245,166,35,0.05)";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 8,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={26} color={text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: "800", color: text }}>
            Notifications
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: AMBER }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.map((item, index) => (
        <View key={item.id}>
          <TouchableOpacity
            onPress={() => markOneRead(item.id)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: item.read ? "transparent" : unreadBg,
              alignItems: "flex-start",
            }}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 10,
                  backgroundColor: isDark ? "#1e2433" : "#f0f0f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="image-outline" size={24} color={subtext} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: text,
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                {!item.read && (
                  <View
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 5,
                      backgroundColor: AMBER,
                      marginLeft: 8,
                      marginTop: 4,
                    }}
                  />
                )}
              </View>
              <Text
                style={{ fontSize: 15, color: subtext, marginTop: 4 }}
                numberOfLines={2}
              >
                {item.message}
              </Text>
              <Text style={{ fontSize: 13, color: subtext, marginTop: 6 }}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
          {index < notifications.length - 1 && <Divider />}
        </View>
      ))}

      {notifications.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 80, gap: 10 }}>
          <Ionicons name="notifications-off-outline" size={40} color={subtext} />
          <Text style={{ color: subtext, fontSize: 14 }}>No notifications yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}