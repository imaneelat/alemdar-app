import { useIsOnline } from "@/hooks/useIsOnline";
import { t, useLocale } from "@/lib/i18n";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BACK_ONLINE_DISPLAY_MS = 2500;

export function OfflineBanner() {
  useLocale();
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();
  const wasOffline = useRef(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      setShowBackOnline(false);
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    setShowBackOnline(true);
    const timeout = setTimeout(() => setShowBackOnline(false), BACK_ONLINE_DISPLAY_MS);
    return () => clearTimeout(timeout);
  }, [isOnline]);

  if (!isOnline) {
    return (
      <View style={[styles.container, styles.offline, { paddingTop: insets.top }]}>
        <Feather name="wifi-off" size={14} color="#FFFFFF" />
        <Text style={styles.text}>{t("offline.banner")}</Text>
      </View>
    );
  }

  if (showBackOnline) {
    return (
      <View style={[styles.container, styles.online, { paddingTop: insets.top }]}>
        <Feather name="wifi" size={14} color="#FFFFFF" />
        <Text style={styles.text}>{t("offline.backOnline")}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  offline: { backgroundColor: "#B33A00" },
  online: { backgroundColor: "#1E8E3E" },
  text: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});
