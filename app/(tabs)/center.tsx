import { useColorScheme } from "@/components/useColorScheme"
import { useOfflineBannerVisible } from "@/hooks/useOfflineBanner"
import { t, useLocale } from "@/lib/i18n"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { FadeInDown } from "react-native-reanimated"
import { FlashList } from "@shopify/flash-list"
import { showServiceConfirm } from "./_layout"
import hizmetData from "@/constants/hizmet-data.json"
import { getColors } from "@/constants/Colors"
import { IconInput } from "@/components/IconInput"

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

function ResultCard({ item, C }: { item: HizmetItem; C: ReturnType<typeof getColors> }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: C.panel, borderRadius: 14,
      borderWidth: 1, borderColor: C.border,
      padding: 16, marginBottom: 10, gap: 12,
      marginHorizontal: 20,
    }}>
      <View style={{
        width: 56, height: 56, borderRadius: 12,
        backgroundColor: C.orange + "22",
        alignItems: "center", justifyContent: "center",
      }}>
        <Text style={{ fontSize: 11, fontWeight: "800", color: C.orange, textAlign: "center" }}>
          {item.code}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: C.muted, marginTop: 4 }} numberOfLines={1}>
          {item.sector}
        </Text>
      </View>
      <View style={{
        backgroundColor: item.list === "list1" ? "#00979d22" : "#f5a62322",
        borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
      }}>
        <Text style={{ fontSize: 10, fontWeight: "700", color: item.list === "list1" ? "#00979d" : C.orange }}>
          {item.list === "list1" ? "VET" : "ESNAF"}
        </Text>
      </View>
    </View>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 0.6, textTransform: "uppercase", color: "#A9AEC0" }}>
        {label}
      </Text>
      {children}
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

  const [formVisible,     setFormVisible]     = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [name,            setName]            = useState("")
  const [phone,           setPhone]           = useState("")
  const [email,           setEmail]           = useState("")
  const [location,        setLocation]        = useState("")
  const [description,     setDescription]     = useState("")
  const [preferredDate,   setPreferredDate]   = useState("")
  const [preferredTime,   setPreferredTime]   = useState("")
  const [submitting,      setSubmitting]      = useState(false)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()
    if (!trimmed) { setLocalResults([]); setLoading(false); return }
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
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const handleRequest = useCallback((service: Service) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedService(service)
    setFormVisible(true)
  }, [])

  const resetForm = () => {
    setName(""); setPhone(""); setEmail("")
    setLocation(""); setDescription("")
    setPreferredDate(""); setPreferredTime("")
  }

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !location.trim() || !description.trim()) {
      Alert.alert(t("service.missingFields"), t("service.missingFieldsDesc"))
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setFormVisible(false)
    resetForm()
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    showServiceConfirm(selectedService?.title ?? "")
  }

  const CARD_HEIGHT = (width - 40) * 0.42
  const isSearching = query.trim().length > 0

  const inputStyle = {
    backgroundColor: C.input,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
  } as const

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
            placeholder={t("service.searchPlaceholder")}
            placeholderTextColor={C.muted}
            style={{ flex: 1, fontSize: 14, color: C.text }}
            returnKeyType="search"
            autoCorrect={false}
          />
          {loading && <ActivityIndicator size="small" color={C.orange} style={{ marginLeft: 8 }} />}
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

      {/* ── SEARCH RESULTS ── */}
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
                  ? `${t("service.noResultsFor")} "${query}"`
                  : `${localResults.length} ${localResults.length === 1 ? t("service.resultsFound") : t("service.resultsFoundPlural")}`}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Ionicons name="search-outline" size={44} color={C.muted} />
                <Text style={{ color: C.muted, fontSize: 14, marginTop: 12 }}>
                  {t("service.noProfessionsFor")} "{query}"
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <ResultCard item={item} C={C} />}
        />
      ) : (
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
                    <TouchableOpacity
                      onPress={() => handleRequest(service)}
                      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.orange, alignItems: "center", justifyContent: "center" }}
                    >
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* ── SERVICE REQUEST FORM MODAL ── */}
      <Modal
        visible={formVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { setFormVisible(false); resetForm() }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.sheet }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Modal Header */}
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
            borderBottomWidth: 1, borderBottomColor: C.border,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: C.orange + "22",
                alignItems: "center", justifyContent: "center",
              }}>
                <Ionicons name={(selectedService?.icon as any) ?? "construct"} size={20} color={C.orange} />
              </View>
              <View>
                <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>
                  {t("service.requestTitle")}
                </Text>
                <Text style={{ fontSize: 12, color: C.muted }}>{selectedService?.title}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => { setFormVisible(false); resetForm() }}
              style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: C.panel,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={18} color={C.muted} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView
            contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >

            <Field label={t("service.fullName") + " *"}>
              <TextInput
                style={inputStyle}
                placeholder={t("service.fullNamePlaceholder")}
                placeholderTextColor={C.muted}
                value={name}
                onChangeText={setName}
              />
            </Field>

            <Field label={t("service.phone") + " *"}>
              <TextInput
                style={inputStyle}
                placeholder={t("service.phonePlaceholder")}
                placeholderTextColor={C.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </Field>

            <Field label={t("service.email")}>
              <TextInput
                style={inputStyle}
                placeholder={t("service.emailPlaceholder")}
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>

            {/* ── Uses IconInput component ── */}
            <Field label={t("service.location") + " *"}>
              <IconInput
                icon="location-outline"
                placeholder={t("service.locationPlaceholder")}
                value={location}
                onChangeText={setLocation}
                colors={C}
              />
            </Field>

            <Field label={t("service.describe") + " *"}>
              <TextInput
                style={[inputStyle, { height: 110, textAlignVertical: "top" }]}
                placeholder={t("service.describePlaceholder")}
                placeholderTextColor={C.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </Field>

            {/* ── Date & Time uses IconInput component ── */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label={t("service.preferredDate")}>
                  <IconInput
                    icon="calendar-outline"
                    placeholder={t("service.datePlaceholder")}
                    value={preferredDate}
                    onChangeText={setPreferredDate}
                    keyboardType="numeric"
                    colors={C}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label={t("service.preferredTime")}>
                  <IconInput
                    icon="time-outline"
                    placeholder={t("service.timePlaceholder")}
                    value={preferredTime}
                    onChangeText={setPreferredTime}
                    keyboardType="numeric"
                    colors={C}
                  />
                </Field>
              </View>
            </View>

            {/* Photos */}
            <Field label={t("service.photos")}>
              <TouchableOpacity
                style={{
                  height: 80, borderRadius: 12,
                  borderWidth: 2, borderColor: C.orange,
                  borderStyle: "dashed",
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: C.orange + "0D",
                  flexDirection: "row", gap: 10,
                }}
                onPress={() => Alert.alert(t("service.comingSoon"), t("service.comingSoonDesc"))}
              >
                <Ionicons name="camera-outline" size={22} color={C.orange} />
                <Text style={{ color: C.orange, fontSize: 14, fontWeight: "600" }}>
                  {t("service.addPhotos")}
                </Text>
              </TouchableOpacity>
            </Field>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              style={{
                backgroundColor: C.orange,
                borderRadius: 14, height: 52,
                alignItems: "center", justifyContent: "center",
                flexDirection: "row", gap: 10,
                opacity: submitting ? 0.7 : 1,
                marginTop: 6,
              }}
            >
              {submitting
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="send" size={18} color="#fff" />
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                      {t("service.submit")}
                    </Text>
                  </>
              }
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  )
}