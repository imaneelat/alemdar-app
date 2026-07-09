import { useColorScheme } from "@/components/useColorScheme"
import { t, useLocale } from "@/lib/i18n"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { showServiceConfirm } from "./_layout"

const getColors = (isDark: boolean) => ({
  bg: isDark ? "#02060E" : "#FFFFFF",
  panel: isDark ? "#101928" : "#F5F5F5",
  border: isDark ? "#26344C" : "#E8E8E8",
  text: isDark ? "#FFFFFF" : "#111111",
  muted: isDark ? "#A9AEC0" : "#6B6B80",
  orange: "#FF6B00",
  danger: "#FF3B30",
})

type Service = {
  id: string
  icon: string
  title: string
  subtitle: string
  image: any
}

const SERVICES: Service[] = [
  { id: "electrician", icon: "flash", title: "Electrician", subtitle: "Wiring, panels, repairs & installation", image: require("@/assets/services/electrician.jpg") },
  { id: "plumber", icon: "water", title: "Plumber", subtitle: "Pipe repair, leaks, bathroom install", image: require("@/assets/services/plumber.jpg") },
  { id: "ac", icon: "snow", title: "AC / Heating", subtitle: "Cooling & heating maintenance & repair", image: require("@/assets/services/ac.jpg") },
  { id: "solar", icon: "sunny", title: "Solar Energy", subtitle: "Panel installation & energy systems", image: require("@/assets/services/solar.jpg") },
  { id: "carpenter", icon: "hammer", title: "Carpenter", subtitle: "Custom furniture, doors & woodwork", image: require("@/assets/services/carpenter.jpg") },
  { id: "network", icon: "wifi", title: "IT & Network", subtitle: "Cabling, WiFi setup & tech support", image: require("@/assets/services/network.jpg") },
  { id: "appliance", icon: "construct", title: "Appliance Repair", subtitle: "Fridge, washer, oven & electronics", image: require("@/assets/services/appliance.jpg") },
  { id: "painter", icon: "color-palette", title: "Painting", subtitle: "Interior, exterior & decorative", image: require("@/assets/services/painter.jpg") },
]

export default function ServiceScreen() {
  useLocale()
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  const C = getColors(isDark)
  const { width } = useWindowDimensions()

  const handleRequest = useCallback((service: Service) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    showServiceConfirm(service.title)
  }, [])

  const CARD_HEIGHT = (width - 40) * 0.42

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: C.text, letterSpacing: -0.5 }}>
              Alemdar<Text style={{ color: C.orange }}>Hizmet</Text>
            </Text>
          </Animated.View>
        </View>

        {SERVICES.map((service, idx) => (
          <Animated.View
            key={service.id}
            entering={FadeInDown.delay(150 + idx * 60).springify()}
            style={{ paddingHorizontal: 20, marginTop: 12 }}
          >
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleRequest(service)}>
              <View style={{ height: CARD_HEIGHT, borderRadius: 18, overflow: "hidden" }}>
                <Image source={service.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <LinearGradient
                  colors={["rgba(2,6,14,0.2)", "rgba(2,6,14,0.85)"]}
                  locations={[0, 0.7]}
                  style={StyleSheet.absoluteFill}
                />
                <View style={{ flex: 1, justifyContent: "flex-end", padding: 16, flexDirection: "row", alignItems: "flex-end" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontSize: 16, fontWeight: "700" }}>{service.title}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2 }}>{service.subtitle}</Text>
                  </View>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.orange, alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
