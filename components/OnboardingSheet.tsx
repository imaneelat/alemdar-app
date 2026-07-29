import { t, useLocale } from "@/lib/i18n";
import { KKTC_CITIES } from "@/lib/kktc-cities";
import { saveDeliveryProfile } from "@/lib/profile-storage";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { visible: boolean; onClose: () => void };

export default function OnboardingSheet({ visible, onClose }: Props) {
  useLocale();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const SHEET_BG = isDark ? "#0d0d0d" : "#ffffff";
  const INPUT_BG = isDark ? "#0B1525" : "#f5f5f5";
  const BORDER   = isDark ? "#26344C" : "#e5e7eb";
  const TEXT     = isDark ? "#ffffff" : "#111111";
  const SUBTEXT  = isDark ? "#A9AEC0" : "#6B7280";
  const HANDLE   = isDark ? "#3a3a3a" : "#d1d5db";
  const OVERLAY  = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)";

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [flat, setFlat]       = useState("");

  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600" as const,
    color: TEXT,
    backgroundColor: INPUT_BG,
    marginTop: 6,
    marginBottom: 12,
  };

  const handleSave = async () => {
    await saveDeliveryProfile({
      name,
      phone,
      address: address.trim(),
      flat: flat.trim(),
      city: KKTC_CITIES[0],
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: OVERLAY }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: SHEET_BG,
                paddingBottom: Math.max(insets.bottom, 20) + 12,
              },
            ]}
          >
            {/* Handle */}
            <View style={[styles.handle, { backgroundColor: HANDLE }]} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              {/* Lottie Animation */}
              <View style={styles.animationWrap}>
                <LottieView
                  source={require("@/assets/animations/onboarding.json")}
                  autoPlay
                  loop
                  style={styles.animation}
                  resizeMode="contain"
                />
              </View>

              {/* Header text */}
              <Text style={[styles.title, { color: TEXT }]}>
                Welcome to Alemdar Teknik
              </Text>
              <Text style={[styles.subtitle, { color: SUBTEXT }]}>
                Save your delivery info now to checkout faster later.
              </Text>

              {/* Name */}
              <Text style={[styles.label, { color: SUBTEXT }]}>
                {t("address.name")}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholderTextColor={SUBTEXT}
                style={inputStyle}
              />

              {/* Phone */}
              <Text style={[styles.label, { color: SUBTEXT }]}>
                {t("address.phone")}
              </Text>
              <View
                style={[
                  styles.phoneWrap,
                  { borderColor: BORDER, backgroundColor: INPUT_BG },
                ]}
              >
                <View style={[styles.phoneCode, { borderRightColor: BORDER }]}>
                  <Text style={{ fontSize: 18 }}>🇹🇷</Text>
                  <Text style={[styles.phoneCodeText, { color: TEXT }]}>
                    +90
                  </Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={SUBTEXT}
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    fontSize: 14,
                    fontWeight: "600" as const,
                    color: TEXT,
                  }}
                />
              </View>

              {/* Address */}
              <Text style={[styles.label, { color: SUBTEXT }]}>
                {t("address.line")}
              </Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholderTextColor={SUBTEXT}
                style={inputStyle}
              />

              {/* Flat */}
              <Text style={[styles.label, { color: SUBTEXT }]}>
                {t("address.flat")}
              </Text>
              <TextInput
                value={flat}
                onChangeText={setFlat}
                placeholderTextColor={SUBTEXT}
                style={inputStyle}
              />

              {/* Save */}
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Save & Continue</Text>
              </TouchableOpacity>

              {/* Skip */}
              <Pressable style={styles.skipBtn} onPress={onClose}>
                <Text style={[styles.skipText, { color: SUBTEXT }]}>
                  Skip for now
                </Text>
                <Feather name="chevron-right" size={14} color={SUBTEXT} />
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:      { flex: 1, justifyContent: "flex-end" },
  keyboardView: { justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  content:      { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 16 },
  animationWrap:{ alignItems: "center", marginBottom: 8 },
  animation:    { width: 180, height: 180 },
  title:        { fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  subtitle:     { fontSize: 13, textAlign: "center", lineHeight: 20, marginBottom: 20 },
  label:        { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  phoneWrap: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  phoneCode: {
    width: 90,
    height: "100%",
    borderRightWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  phoneCodeText: { fontSize: 16, fontWeight: "700" },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveBtnText:  { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  skipBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 4,
  },
  skipText:     { fontSize: 13, fontWeight: "600" },
});