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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [flat, setFlat] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string>(KKTC_CITIES[0]);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
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

    return () => {
      cancelled = true;
    };
  }, []);

  const cityWords = address.trim().split(/\s+/).slice(0, 2).join(", ");
  const inputStyle = {
    height: 48,
    borderWidth: 1,
    borderColor: "#26344C",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    backgroundColor: "#0B1525",
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
              <Feather name="chevron-left" size={38} color="#FFFFFF" />
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

            <Text style={styles.title}>{t("address.title")}</Text>

            <Text style={styles.label}>{t("address.name")}</Text>
            <TextInput
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (nameError) setNameError(false);
              }}
              placeholderTextColor="#A9AEC0"
              style={[inputStyle, nameError && styles.inputError]}
            />
            {nameError ? (
              <Text style={styles.errorText}>{t("address.required")}</Text>
            ) : null}

            <Text style={styles.label}>{t("address.phone")}</Text>
            <View style={[styles.phoneWrap, phoneError && styles.inputError]}>
              <View style={styles.phoneCode}>
                <Text style={{ fontSize: 18 }}>🇹🇷</Text>
                <Text style={styles.phoneCodeText}>+90</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  if (phoneError) setPhoneError(false);
                }}
                keyboardType="phone-pad"
                placeholderTextColor="#A9AEC0"
                style={{
                  flex: 1,
                  paddingHorizontal: 12,
                  fontSize: 14,
                  fontWeight: "700" as const,
                  color: "#FFFFFF",
                }}
              />
            </View>
            {phoneError ? (
              <Text style={styles.errorText}>{t("address.required")}</Text>
            ) : null}

            <Text style={styles.label}>{t("address.line")}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#A9AEC0"
              style={inputStyle}
            />

            <Text style={styles.label}>{t("address.flat")}</Text>
            <TextInput
              value={flat}
              onChangeText={setFlat}
              placeholderTextColor="#A9AEC0"
              style={inputStyle}
            />

            <Text style={styles.label}>{t("address.city")}</Text>
            <Pressable
              onPress={() => setCityPickerVisible(true)}
              style={[inputStyle, styles.citySelect]}
            >
              <Text style={styles.citySelectText}>{city}</Text>
              <Feather name="chevron-down" size={18} color="#A9AEC0" />
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
          style={styles.modalOverlay}
          onPress={() => setCityPickerVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 20) + 12 },
            ]}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>{t("address.city")}</Text>
            {KKTC_CITIES.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setCity(option);
                  setCityPickerVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {option === city ? (
                  <Feather name="check" size={18} color="#FF6B00" />
                ) : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#02060E" },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 24,
  },
  animationWrap: {
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  animation: { width: 200, height: 200 },
  city: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 13,
    color: "#A9AEC0",
    marginBottom: 4,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  phoneWrap: {
    height: 48,
    borderWidth: 1,
    borderColor: "#26344C",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1525",
    marginTop: 6,
    marginHorizontal: 24,
    overflow: "hidden",
  },
  phoneCode: {
    width: 90,
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#26344C",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  phoneCodeText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  saveBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
  },
  saveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  inputError: { borderColor: "#FF4D4D" },
  errorText: {
    color: "#FF4D4D",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    paddingHorizontal: 24,
  },
  citySelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  citySelectText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 14, 0.7)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0B1525",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  modalOption: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#26344C",
  },
  modalOptionText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});
