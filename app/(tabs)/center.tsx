import { useColorScheme } from "@/components/useColorScheme"
import { useOfflineBannerVisible } from "@/hooks/useOfflineBanner"
import { useLocale } from "@/lib/i18n"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"
import { FlashList } from "@shopify/flash-list"
import { showServiceConfirm } from "./_layout"
import hizmetData from "@/constants/hizmet-data.json"

const getColors = (isDark: boolean) => ({
  bg:     isDark ? "#02060E" : "#FFFFFF",
  panel:  isDark ? "#101928" : "#F5F5F5",
  border: isDark ? "#26344C" : "#E8E8E8",
  text:   isDark ? "#FFFFFF" : "#111111",
  muted:  isDark ? "#A9AEC0" : "#6B6B80",
  input:  isDark ? "#101928" : "#F0F0F5",
  orange: "#FF6B00",
})

type Service = {
  id: string
  icon: string
  title: string
  subtitle: string
  image: any
}

type HizmetItem = {
  code: string
  sector_code: string
  sector: string
  name: string
  list: string
  area_code?: string
  isco?: string
}

const SERVICES: Service[] = [
  { id: "electrician", icon: "flash",        title: "Electrician",      subtitle: "Wiring, panels, repairs & installation",  image: require("@/assets/services/electrician.jpg") },
  { id: "plumber",     icon: "water",         title: "Plumber",          subtitle: "Pipe repair, leaks, bathroom install",    image: require("@/assets/services/plumber.jpg") },
  { id: "ac",          icon: "snow",          title: "AC / Heating",     subtitle: "Cooling & heating maintenance & repair",  image: require("@/assets/services/ac.jpg") },
  { id: "solar",       icon: "sunny",         title: "Solar Energy",     subtitle: "Panel installation & energy systems",     image: require("@/assets/services/solar.jpg") },
  { id: "carpenter",   icon: "hammer",        title: "Carpenter",        subtitle: "Custom furniture, doors & woodwork",      image: require("@/assets/services/carpenter.jpg") },
  { id: "network",     icon: "wifi",          title: "IT & Network",     subtitle: "Cabling, WiFi setup & tech support",      image: require("@/assets/services/network.jpg") },
  { id: "appliance",   icon: "construct",     title: "Appliance Repair", subtitle: "Fridge, washer, oven & electronics",     image: require("@/assets/services/appliance.jpg") },
  { id: "painter",     icon: "color-palette", title: "Painting",         subtitle: "Interior, exterior & decorative",        image: require("@/assets/services/painter.jpg") },
]

// ── Turkish-aware normalizer ──────────────────────────────────────
function normalize(str: string): string {
  return str
    .replace(/İ/g, "i").replace(/I/g, "ı")
    .replace(/Ğ/g, "ğ").replace(/Ü/g, "ü")
    .replace(/Ş/g, "ş").replace(/Ö/g, "ö")
    .replace(/Ç/g, "ç")
    .toLowerCase()
}

function turkishIncludes(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query))
}

// ── Result Card ───────────────────────────────────────────────────
function ResultCard({ item, C }: { item: HizmetItem; C: ReturnType<typeof getColors> }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: C.panel, borderRadius: 14,
      borderWidth: 1, borderColor: C.border,
      padding: 16, marginBottom: 10, gap: 12,
      marginHorizontal: 20,
    }}>
      {/* Code badge */}
      <View style={{
        width: 56, height: 56, borderRadius: 12,
        backgroundColor: C.orange + "22",
        alignItems: "center", justifyContent: "center",
      }}>
        <Text style={{ fontSize: 11, fontWeight: "800", color: C.orange, textAlign: "center" }}>
          {item.code}
        </Text>
      </View>

      {/* Name + sector */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }} numberOfLines={1}>
          {item.sector}
        </Text>
      </View>

      {/* List badge */}
      <View style={{
        backgroundColor: item.list === "list1" ? "#00979d22" : "#f5a62322",
        borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
      }}>
        <Text style={{
          fontSize: 10, fontWeight: "700",
          color: item.list === "list1" ? "#00979d" : C.orange,
        }}>
          {item.list === "list1" ? "VET" : "ESNAF"}
        </Text>
      </View>
    </View>
  )
}

export default function ServiceScreen() {
  useLocale()
  const scheme  = useColorScheme()
  const isDark  = scheme === "dark"
  const C       = getColors(isDark)
  const { width } = useWindowDimensions()
  const offlineBannerVisible = useOfflineBannerVisible()

  const [query,        setQuery]        = useState("")
  const [localResults, setLocalResults] = useState<HizmetItem[]>([])
  const [loading,      setLoading]      = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleRequest = useCallback((service: Service) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    showServiceConfirm(service.title)
  }, [])

  // ── Search logic ─────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()

    if (!trimmed) {
      setLocalResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      const results = (hizmetData as HizmetItem[]).filter(
        item =>
          turkishIncludes(item.name,   trimmed) ||
          turkishIncludes(item.sector, trimmed) ||
          turkishIncludes(item.code,   trimmed)
      )
      setLocalResults(results)
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const CARD_HEIGHT = (width - 40) * 0.42
  const isSearching = query.trim().length > 0

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={offlineBannerVisible ? [] : ["top"]}>

      {/* ── HEADER ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: C.text, letterSpacing: -0.5 }}>
            Alemdar<Text style={{ color: C.orange }}>Hizmet</Text>
          </Text>
        </Animated.View>
      </View>

      {/* ── SEARCH BAR ── */}
      <Animated.View entering={FadeInDown.delay(150)} style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 4 }}>
        <View style={{
          flexDirection: "row", alignItems: "center",
          backgroundColor: C.input, borderRadius: 12,
          borderWidth: 1, borderColor: C.border,
          paddingHorizontal: 12, height: 46,
        }}>
          <Ionicons name="search" size={16} color={C.muted} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search professions or trade sectors..."
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontSize: 14, color: C.text }}
            returnKeyType="search"
            autoCorrect={false}
          />
          {loading && (
            <ActivityIndicator size="small" color={C.orange} style={{ marginLeft: 8 }} />
          )}
          {!loading && query.length > 0 && (
            <TouchableOpacity onPress={() => {
              setQuery("")
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }}>
              <Ionicons name="close-circle" size={18} color={C.muted} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── SEARCH RESULTS using FlashList ── */}
      {isSearching ? (
        <FlashList
          data={localResults}
          keyExtractor={item => `${item.list}-${item.code}`}
          
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 110, paddingTop: 8 }}
          ListHeaderComponent={
            !loading ? (
              <Text style={{ fontSize: 12, color: C.muted, marginBottom: 10, marginHorizontal: 20 }}>
                {localResults.length === 0
                  ? `No results for "${query}"`
                  : `${localResults.length} result${localResults.length !== 1 ? "s" : ""} found`}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Ionicons name="search-outline" size={44} color={C.muted} />
                <Text style={{ color: C.muted, fontSize: 14, marginTop: 12 }}>
                  No professions found for "{query}"
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <ResultCard item={item} C={C} />}
        />
      ) : (
        /* ── SERVICES GRID ── */
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
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
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{service.title}</Text>
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
      )}
    </SafeAreaView>
  )
}
