 import { useColorScheme } from "@/components/useColorScheme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  Surface,
  Text,
  Divider,
  List,
  TouchableRipple,
  Button,
} from "react-native-paper";
import { View } from "react-native";
import { openSheet } from "./_layout";
import * as StoreReview from "expo-store-review";
import { t, useLocale } from "@/lib/i18n";

const darkColors = {
  bg:          "#02060E",
  panel:       "#101928",
  panelBorder: "#26344C",
  divider:     "#243047",
  text:        "#FFFFFF",
  muted:       "#A9AEC0",
  orange:      "#FF6B00",
  danger:      "#FF3B30",
};

const lightColors = {
  bg:          "#F5F6F8",
  panel:       "#FFFFFF",
  panelBorder: "#E3E6EC",
  divider:     "#ECEEF2",
  text:        "#0B1220",
  muted:       "#6B7280",
  orange:      "#FF6B00",
  danger:      "#D92D20",
};

export default function AccountScreen() {
  useLocale();
  const colorScheme = useColorScheme();
  const C = colorScheme === "dark" ? darkColors : lightColors;

  const quickLinks = [
    { icon: "shopping-bag", label: t("myOrders"),  value: t("ordersCount")  },
    { icon: "heart",        label: t("wishlist"),   value: t("wishlistCount") },
    { icon: "ticket",       label: t("coupons"),    value: t("couponsCount") },
    { icon: "clock",        label: t("history"),    value: t("historyCount") },
  ] as const;

  const menuItems = [
    { icon: "map-marker-outline",    title: t("addresses"),    onPress: () => router.push("/address-edit") },
    { icon: "account-group-outline", title: t("helpCenter"),   onPress: () => router.push("/help-center")  },
    { icon: "information-outline",   title: t("rateApp"),      onPress: () => StoreReview.requestReview()  },
    { icon: "shield-check-outline",  title: t("privacyPolicy"),onPress: () => openSheet("privacy")         },
    { icon: "translate",             title: t("language"),     onPress: () => openSheet("language")        },
    {
      icon: "delete-outline",
      title: t("deleteAccount"),
      onPress: () =>
        Alert.alert(t("deleteAccount"), t("deleteWarning"), [
          { text: t("cancel"), style: "cancel" },
          { text: t("deleteConfirm"), style: "destructive", onPress: () => {} },
        ]),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={{ marginTop: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          {/* Avatar + name */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
              <Svg width={40} height={40} viewBox="0 0 32 32">
                <Path d="M12.8 11.2a3.2 3.2 0 1 1 6.4 0 3.2 3.2 0 0 1-6.4 0Zm-0.8 4.8h8a2.4 2.4 0 0 1 2.4 2.4c0 1.8-0.7 3.2-1.9 4.2-1.2 1-2.8 1.4-4.5 1.4-1.7 0-3.3-0.5-4.5-1.4C10.3 21.6 9.6 20.2 9.6 18.4A2.4 2.4 0 0 1 12 16ZM16 3.2a12.8 12.8 0 1 0 0 25.6 12.8 12.8 0 0 0 0-25.6Zm-11.2 12.8a11.2 11.2 0 1 1 22.4 0 11.2 11.2 0 0 1-22.4 0Z" fill={C.muted} />
              </Svg>
            </View>
            <Text variant="titleSmall" style={{ color: C.text }}>{t("profileName")}</Text>
          </View>

          {/* Icons */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            <View style={{ position: "relative" }}>
              <Svg width={22} height={22} viewBox="0 0 32 32">
                <Path d="M28.7 19.3L26 16.6V13a10 10 0 0 0-9-9.9V1h-2v2A10 10 0 0 0 6 13v3.6l-2.7 2.7A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v1a5 5 0 0 0 10 0v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-0.3-0.7ZM19 25a3 3 0 0 1-6 0v-1h6Z" fill={C.text} />
              </Svg>
              <View style={{ position: "absolute", top: -4, right: -8 }}>
                <Text style={{ color: C.orange, fontSize: 10, fontWeight: "800" }}>{t("notifications")}</Text>
              </View>
            </View>
            <Svg width={23} height={23} viewBox="0 0 32 32">
              <Path d="M16 30.7L3.3 23.3V8.7L16 1.3 28.7 8.7V23.3L16 30.7ZM16 4.4L6 10.2V21.8L16 27.6 26 21.8V10.2L16 4.4V4.4ZM16 21.3C14.6 21.3 13.2 20.8 12.2 19.8 10.7 18.2 10.2 15.9 11.1 14 11.9 12 13.8 10.7 16 10.7 17.4 10.7 18.8 11.2 19.8 12.2 21.9 14.3 21.9 17.7 19.8 19.8 18.8 20.8 17.4 21.3 16 21.3ZM16 13.3C14.7 13.3 13.6 14.2 13.4 15.5 13.1 16.7 13.8 18 15 18.5 16.2 18.9 17.5 18.5 18.2 17.5 18.9 16.4 18.8 15 17.9 14.1 17.4 13.6 16.7 13.3 16 13.3Z" fill={C.text} />
            </Svg>
          </View>
        </View>

        {/* ── Quick-links card ── */}
        <Surface
          style={{ marginTop: 13, borderRadius: 7, borderWidth: 1, borderColor: C.panelBorder, backgroundColor: C.panel }}
          elevation={0}
        >
          <View style={{ flexDirection: "row", height: 86 }}>
            {quickLinks.map((item, index) => (
              <View key={item.label} style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 3 }}>
                {index > 0 && (
                  <View style={{ position: "absolute", left: 0, top: 15, bottom: 15, width: 1, backgroundColor: C.divider }} />
                )}
                {item.icon === "shopping-bag" ? (
                  <Svg width={22} height={22} viewBox="0 0 28 28">
                    <Path d="M7 7C7 3.1 10.1 0 14 0s7 3.1 7 7v3h4c1.7 0 3 1.3 3 3v13c0 3.3-2.7 6-6 6H6c-3.3 0-6-2.7-6-6V13c0-1.7 1.3-3 3-3h4v-3z m3 3h8v-3c0-2.2-1.8-4-4-4s-4 1.8-4 4v3z m-1.5 6c0.8 0 1.5-0.7 1.5-1.5s-0.7-1.5-1.5-1.5-1.5 0.7-1.5 1.5 0.7 1.5 1.5 1.5z m11-3c-0.8 0-1.5 0.7-1.5 1.5s0.7 1.5 1.5 1.5 1.5-0.7 1.5-1.5-0.7-1.5-1.5-1.5z" fill={C.text} />
                  </Svg>
                ) : item.icon === "heart" ? (
                  <Feather name="heart" size={23} color={C.text} />
                ) : item.icon === "clock" ? (
                  <Svg width={22} height={22} viewBox="0 0 32 32">
                    <Path d="M6.8 8L10.7 8 10.7 10.7 2.7 10.7 2.7 2.7 5.3 2.7 5.3 5.7C8.3 2.5 11.7 1.3 16 1.3 24.1 1.3 30.7 7.9 30.7 16 30.7 24.1 24.1 30.7 16 30.7 7.9 30.7 1.3 24.1 1.3 16L4 16C4 22.6 9.4 28 16 28 22.6 28 28 22.6 28 16 28 9.4 22.6 4 16 4 12.2 4 9.4 5.1 6.8 8ZM17.3 14.7L22.7 14.7 22.7 17.3 14.7 17.3 14.7 8 17.3 8 17.3 14.7Z" fill={C.text} fillRule="evenodd" />
                  </Svg>
                ) : (
                  <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={C.text} />
                )}
                <Text variant="labelSmall" style={{ color: C.text, marginTop: 7 }}>{item.label}</Text>
                <Text variant="labelSmall" style={{ color: C.muted, marginTop: 1, fontSize: 10 }}>{item.value}</Text>
              </View>
            ))}
          </View>
        </Surface>

        {/* ── Menu list ── */}
        <Surface
          style={{ marginTop: 18, borderRadius: 7, borderWidth: 1, borderColor: C.panelBorder, backgroundColor: C.panel, overflow: "hidden" }}
          elevation={0}
        >
          {menuItems.map((item, idx) => (
            <View key={item.title}>
              <TouchableRipple onPress={item.onPress} rippleColor="rgba(255,255,255,0.06)">
                <List.Item
                  title={item.title}
                  titleStyle={{ color: C.text, fontSize: 13, fontWeight: "500" }}
                  left={() => (
                    <List.Icon
                      icon={({ size }) => (
                        <MaterialCommunityIcons name={item.icon as any} size={size} color={C.orange} />
                      )}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                  right={() => <Feather name="chevron-right" size={20} color={C.muted} style={{ alignSelf: "center", marginRight: 4 }} />}
                  style={{ paddingVertical: 2, paddingLeft: 4 }}
                />
              </TouchableRipple>
              {idx < menuItems.length - 1 && <Divider style={{ backgroundColor: C.divider }} />}
            </View>
          ))}
        </Surface>

        {/* ── Log out ── */}
        <Button
          mode="outlined"
          onPress={() => {}}
          icon={() => <Feather name="arrow-right" size={14} color={C.danger} />}
          textColor={C.danger}
          style={{ marginTop: 17, borderRadius: 7, borderColor: C.panelBorder, backgroundColor: C.panel }}
          contentStyle={{ flexDirection: "row-reverse" }}
          labelStyle={{ fontSize: 11, fontWeight: "700" }}
        >
          {t("logOut")}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
