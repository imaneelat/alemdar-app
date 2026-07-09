import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { View, Text, TouchableOpacity } from "react-native"
import { router } from "expo-router"
import * as StoreReview from "expo-store-review"
import { openSheet } from "@/app/(tabs)/_layout"
import BottomSheet, { type BottomSheetMethods } from "@devvie/bottom-sheet"
import { useEffect, useRef } from "react"

const C = {
  bg: "#02060E",
  panel: "#101928",
  panelBorder: "#26344C",
  text: "#FFFFFF",
  muted: "#A9AEC0",
  orange: "#FF6B00",
}

type Props = { visible: boolean; onClose: () => void }

export default function SettingsSheet({ visible, onClose }: Props) {
  const sheetRef = useRef<BottomSheetMethods>(null)

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
      height="50%"
      style={{ backgroundColor: C.panel }}
      closeOnDragDown
      closeOnBackdropPress
      onClose={onClose}
    >
      <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.title} onPress={item.onPress} style={{ paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 16 }}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={C.orange} />
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "500", flex: 1 }}>{item.title}</Text>
            <Feather name="chevron-right" size={20} color={C.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  )
}
