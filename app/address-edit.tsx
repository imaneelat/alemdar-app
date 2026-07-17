import { t, useLocale } from "@/lib/i18n";
import { KKTC_CITIES } from "@/lib/kktc-cities";
import {
  deliveryProfileSchema,
  loadDeliveryProfile,
  saveDeliveryProfile,
} from "@/lib/profile-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { z } from "zod";

const addressFormSchema = deliveryProfileSchema.pick({
  name: true,
  phone: true,
});

export default function AddressEditScreen() {
  useLocale();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const BG            = isDark ? "#02060E"            : "#f2f2f7";
  const INPUT_BG      = isDark ? "#0B1525"            : "#ffffff";
  const BORDER        = isDark ? "#26344C"            : "#d1d5db";
  const TEXT          = isDark ? "#FFFFFF"            : "#111111";
  const LABEL         = isDark ? "#A9AEC0"            : "#6B7280";
  const PH_COLOR      = isDark ? "#A9AEC0"            : "#9ca3af";
  const MODAL_BG      = isDark ? "#0B1525"            : "#ffffff";
  const MODAL_OVERLAY = isDark ? "rgba(2,6,14,0.75)" : "rgba(0,0,0,0.45)";
  const MODAL_BORDER  = isDark ? "#26344C"            : "#e5e7eb";

  const [name, setName]                           = useState("");
  const [address, setAddress]                     = useState("");
  const [flat, setFlat]                           = useState("");
  const [phone, setPhone]                         = useState("");
  const [city, setCity]                           = useState<string>(KKTC_CITIES[0]);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [nameError, setNameError]                 = useState(false);
  const [phoneError, setPhoneError]               = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = await loadDeliveryProfile();
      if (!profile || cancelled) return;
      setName(profile.name);
      setAddress(profile.address);
      setFlat(profile.flat);
      setPhone(profile.phone);
      setCity(profile.city || KKTC_CITIES[0]);
    })();
    return () => { cancelled = true; };
  }, []);

  const cityWords = address.trim().split(/\s+/).slice(0, 2).join(", ");

  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "700" as const,
    color: TEXT,
    backgroundColor: INPUT_BG,
    marginTop: 6,
    marginHorizontal: 24,
  };

  const handleSave = async () => {
    const result = addressFormSchema.safeParse({ name, phone });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setNameError(!!fieldErrors.name);
      setPhoneError(!!fieldErrors.phone);
      return;
    }
    setNameError(false);
    setPhoneError(false);
    await saveDeliveryProfile({
      name: result.data.name,
      phone: result.data.phone,
      address: address.trim(),
      flat: flat.trim(),
      city,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable onPress={Keyboard.dismiss}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="chevron-left" size={38} color={TEXT} />
            </Pressable>

            <View style={styles.animationWrap}>
              <LottieView
                source={require("@/assets/animations/location.json")}
                autoPlay
                loop
                style={styles.animation}
                resizeMode="contain"
              />
            </View>

            {cityWords ? <Text style={styles.city}>{cityWords}</Text> : null}

            <Text style={[styles.title, { color: TEXT }]}>{t("address.title")}</Text>

            <Text style={[styles.label, { color: LABEL }]}>{t("address.name")}</Text>
            <TextInput
              value={name}
              onChangeText={(value) => { setName(value); if (nameError) setNameError(false); }}
              placeholderTextColor={PH_COLOR}
              style={[inputStyle, nameError && styles.inputError]}
            />
            {nameError ? <Text style={styles.errorText}>{t("address.required")}</Text> : null}

            <Text style={[styles.label, { color: LABEL }]}>{t("address.phone")}</Text>
            <View style={[
              styles.phoneWrap,
              { borderColor: BORDER, backgroundColor: INPUT_BG },
              phoneError && styles.inputError,
            ]}>
              <View style={[styles.phoneCode, { borderRightColor: BORDER }]}>
                <Text style={{ fontSize: 18 }}>🇹🇷</Text>
                <Text style={[styles.phoneCodeText, { color: TEXT }]}>+90</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(value) => { setPhone(value); if (phoneError) setPhoneError(false); }}
                keyboardType="phone-pad"
                placeholderTextColor={PH_COLOR}
                style={{ flex: 1, paddingHorizontal: 12, fontSize: 14, fontWeight: "700" as const, color: TEXT }}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{t("address.required")}</Text> : null}

            <Text style={[styles.label, { color: LABEL }]}>{t("address.line")}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={PH_COLOR}
              style={inputStyle}
            />

            <Text style={[styles.label, { color: LABEL }]}>{t("address.flat")}</Text>
            <TextInput
              value={flat}
              onChangeText={setFlat}
              placeholderTextColor={PH_COLOR}
              style={inputStyle}
            />

            <Text style={[styles.label, { color: LABEL }]}>{t("address.city")}</Text>
            <Pressable
              onPress={() => setCityPickerVisible(true)}
              style={[inputStyle, styles.citySelect]}
            >
              <Text style={[styles.citySelectText, { color: TEXT }]}>{city}</Text>
              <Feather name="chevron-down" size={18} color={LABEL} />
            </Pressable>

            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>{t("address.save")}</Text>
            </Pressable>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={cityPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCityPickerVisible(false)}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: MODAL_OVERLAY }]}
          onPress={() => setCityPickerVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { backgroundColor: MODAL_BG, paddingBottom: Math.max(insets.bottom, 20) + 12 },
            ]}
            onPress={() => {}}
          >
            <Text style={[styles.modalTitle, { color: TEXT }]}>{t("address.city")}</Text>
            {KKTC_CITIES.map((option) => (
              <Pressable
                key={option}
                style={[styles.modalOption, { borderBottomColor: MODAL_BORDER }]}
                onPress={() => { setCity(option); setCityPickerVisible(false); }}
              >
                <Text style={[styles.modalOptionText, { color: TEXT }]}>{option}</Text>
                {option === city ? <Feather name="check" size={18} color="#FF6B00" /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  flex:            { flex: 1 },
  scrollContent:   { paddingBottom: 24 },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 24,
  },
  animationWrap:   { alignItems: "center", marginBottom: 8, paddingHorizontal: 24 },
  animation:       { width: 200, height: 200 },
  city: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title:           { fontSize: 22, fontWeight: "900", marginBottom: 20, paddingHorizontal: 24 },
  label:           { fontSize: 13, marginBottom: 4, marginTop: 12, paddingHorizontal: 24 },
  phoneWrap: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginHorizontal: 24,
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
  phoneCodeText:   { fontSize: 16, fontWeight: "700" },
  saveBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
  },
  saveText:        { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  inputError:      { borderColor: "#FF4D4D" },
  errorText: {
    color: "#FF4D4D",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    paddingHorizontal: 24,
  },
  citySelect:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  citySelectText:  { fontSize: 14, fontWeight: "700" },
  modalOverlay:    { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalTitle:      { fontSize: 18, fontWeight: "900", marginBottom: 12 },
  modalOption: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  modalOptionText: { fontSize: 15, fontWeight: "700" },
});
