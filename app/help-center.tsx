import { useOfflineBannerVisible } from "@/hooks/useOfflineBanner";
import { t, useLocale } from "@/lib/i18n";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Image, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CONTACT_OPTIONS = [
  { key: "call", labelKey: "help.callCenter", icon: require("@/assets/icons/helpcenter/callcenter.png") },
  { key: "whatsapp", labelKey: "help.whatsapp", icon: require("@/assets/icons/helpcenter/whatsapp.png") },
  { key: "email", labelKey: "help.email", icon: require("@/assets/icons/helpcenter/email.png") },
  { key: "faq", labelKey: "help.faq", icon: require("@/assets/icons/helpcenter/FAQ.png") },
];

export default function HelpCenterScreen() {
  useLocale();
  const { width: screenWidth } = useWindowDimensions();
  const cardSize = (screenWidth - 48 - 20) / 2;
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const offlineBannerVisible = useOfflineBannerVisible();

  const BG         = isDark ? "#02060E"  : "#f2f2f7";
  const CARD_BG    = isDark ? "#101928"  : "#ffffff";
  const BORDER     = isDark ? "#26344C"  : "#e5e7eb";
  const TEXT       = isDark ? "#FFFFFF"  : "#111111";
  const MUTED      = isDark ? "#A9AEC0"  : "#6B7280";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: BG }]}
      edges={offlineBannerVisible ? [] : ["top"]}
    >
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="chevron-left" size={38} color={TEXT} />
      </Pressable>
      <View style={styles.animationWrap}>
        <LottieView source={require("@/assets/animations/help_support.json")} autoPlay loop speed={0.4} style={styles.animation} resizeMode="contain" />
      </View>
      <View style={styles.grid}>
        {CONTACT_OPTIONS.map((option) => (
          <Pressable key={option.key} style={[styles.card, { width: cardSize, height: cardSize, backgroundColor: CARD_BG, borderColor: BORDER }]} onPress={() => {
            if (option.key === "call") Linking.openURL("tel:+974****7312");
            if (option.key === "whatsapp") Linking.openURL("https://wa.me/974****7312");
            if (option.key === "email") Linking.openURL("mailto:makan@info.com");
            if (option.key === "faq") router.push("/help/faq");
          }}>
            <Image source={option.icon} style={styles.iconImage} resizeMode="contain" />
            <Text style={[styles.cardLabel, { color: TEXT }]}>{t(option.labelKey)}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.versionText, { color: MUTED }]}>Version 1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12, alignItems: "center" },
  backBtn: { alignSelf: "flex-start", marginBottom: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  animationWrap: { width: "100%", alignItems: "center", marginBottom: 14 },
  animation: { width: 280, height: 280 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%" },
  card: { borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, marginBottom: 20 },
  iconImage: { width: 44, height: 44, marginBottom: 16 },
  cardLabel: { fontSize: 16, fontWeight: "600" },
  versionText: { width: "100%", textAlign: "center", fontSize: 12, marginTop: 6 },
});
