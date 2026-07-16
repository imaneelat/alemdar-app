import { t, useLocale } from "@/lib/i18n";
import { useIsOnline } from "@/hooks/useIsOnline";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfflineBanner() {
  useLocale();
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Feather name="wifi-off" size={14} color="#FFFFFF" />
      <Text style={styles.text}>{t("offline.banner")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: "#B33A00",
  },
  text: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});
