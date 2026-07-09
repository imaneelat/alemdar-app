import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { View, Text, TouchableOpacity, Appearance } from "react-native"
import { router } from "expo-router"
import * as StoreReview from "expo-store-review"
import { openSheet } from "@/app/(tabs)/_layout"
import BottomSheet, { type BottomSheetMethods } from "@devvie/bottom-sheet"
import { useEffect, useRef } from "react"
import { useColorScheme } from "@/components/useColorScheme"

type Props = { visible: boolean; onClose: () => void }

export default function SettingsSheet({ visible, onClose }: Props) {
  const sheetRef = useRef<BottomSheetMethods>(null)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const C = {
    panel: isDark ? "#101928" : "#ffffff",
    text: isDark ? "#FFFFFF" : "#111111",
    muted: isDark ? "#A9AEC0" : "#888888",
    orange: "#FF6B00",
    divider: isDark ? "#1e2433" : "#f0f0f5",
  }

  useEffect(() => {
    if (visible) sheetRef.current?.open()
    else sheetRef.current?.close()
  }, [visible])

  const menuItems = [
    { icon: "map-marker-outline", title: "Addresses", onPress: () => { onClose(); router.push("/address-edit") } },
    { icon: "account-group-outline", title: "Help Center", onPress: () => { onClose(); router.push("/help-center") } },
    { icon: "information-outline", title: "Rate App", onPress: () => StoreReview.requestReview() },
    { icon: "shield-check-outline", title: "Privacy Policy", onPress: () => { onClose(); setTimeout(() => openSheet("privacy"), 300) } },
    { icon: "translate", title: "Language", onPress: () => { onClose(); setTimeout(() => openSheet("language"), 300) } },
  ]

  return (
    <BottomSheet
      ref={sheetRef}
      height="55%"
      style={{ backgroundColor: C.panel }}
      closeOnDragDown
      closeOnBackdropPress
      onClose={onClose}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>

        {/* Dark mode toggle */}
        <View
          style={{
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.divider,
            marginBottom: 4,
          }}
        >
          <MaterialCommunityIcons
            name={isDark ? "moon-waning-crescent" : "white-balance-sunny"}
            size={28}
            color={C.orange}
          />
          <Text style={{ color: C.text, fontSize: 15, fontWeight: "500", flex: 1 }}>
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>

          {/* Custom toggle */}
          <TouchableOpacity
            onPress={() => Appearance.setColorScheme(isDark ? "light" : "dark")}
            activeOpacity={0.9}
            style={{
              width: 52,
              height: 30,
              borderRadius: 15,
              backgroundColor: isDark ? C.orange : "#e0e0e0",
              justifyContent: "center",
              paddingHorizontal: 3,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#fff",
                alignSelf: isDark ? "flex-end" : "flex-start",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 3,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            onPress={item.onPress}
            style={{
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
              borderBottomColor: C.divider,
            }}
          >
            <MaterialCommunityIcons name={item.icon as any} size={28} color={C.orange} />
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "500", flex: 1 }}>{item.title}</Text>
            <Feather name="chevron-right" size={20} color={C.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  )
}
