import { useOfflineBannerState } from "@/hooks/useOfflineBanner";
import { t, useLocale } from "@/lib/i18n";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfflineBanner() {
  useLocale();
  const state = useOfflineBannerState();
  const insets = useSafeAreaInsets();

  if (state === "offline") {
    return (
      <View style={[styles.container, styles.offline, { paddingTop: insets.top }]}>
        <Feather name="wifi-off" size={14} color="#FFFFFF" />
        <Text style={styles.text}>{t("offline.banner")}</Text>
      </View>
    );
  }

  if (state === "backOnline") {
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
