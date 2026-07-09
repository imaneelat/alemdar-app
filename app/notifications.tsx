import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View, useColorScheme, ScrollView, RefreshControl } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
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

function NotificationSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <SkeletonPlaceholder
      backgroundColor={isDark ? "#1e2433" : "#e0e0e0"}
      highlightColor={isDark ? "#2a3450" : "#f5f5f5"}
      speed={1200}
    >
      <>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonPlaceholder.Item
            key={i}
            flexDirection="row"
            alignItems="flex-start"
            paddingHorizontal={16}
            paddingVertical={12}
            gap={12}
          >
            <SkeletonPlaceholder.Item width={64} height={64} borderRadius={10} />
            <SkeletonPlaceholder.Item flex={1} gap={8}>
              <SkeletonPlaceholder.Item width={140} height={14} borderRadius={6} />
              <SkeletonPlaceholder.Item width={"90%"} height={12} borderRadius={6} />
              <SkeletonPlaceholder.Item width={80} height={12} borderRadius={6} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}
      </>
    </SkeletonPlaceholder>
  );
}

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const bg = isDark ? "#000000" : "#ffffff";
  const text = isDark ? "#ffffff" : "#111111";
  const subtext = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
  const unreadBg = isDark ? "rgba(245,166,35,0.06)" : "rgba(245,166,35,0.05)";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    // Replace setTimeout with your real API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      {/* Header */}
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
          {unreadCount > 0 && (
            <View
              style={{
                backgroundColor: AMBER,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 5,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#000" }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: AMBER }}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Skeleton while loading */}
      {loading ? (
        <NotificationSkeleton isDark={isDark} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={AMBER}
              colors={[AMBER]}
            />
          }
        >
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
                    style={{ width: 64, height: 64, borderRadius: 10 }}
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
                    <Text style={{ fontSize: 15, fontWeight: "700", color: text, flex: 1 }}>
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
}