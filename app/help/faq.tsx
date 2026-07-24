import { useOfflineBannerVisible } from "@/hooks/useOfflineBanner";
import { t, useLocale } from "@/lib/i18n";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FaqScreen() {
  useLocale();
  const offlineBannerVisible = useOfflineBannerVisible();
  const [open, setOpen] = useState<string | null>(null);
  const faqs = useMemo(() => [
    { id: "1", question: t("faq.getStarted.question"), answer: t("faq.getStarted.answer"), icon: "help-circle" },
    { id: "2", question: t("faq.dataSecure.question"), answer: t("faq.dataSecure.answer"), icon: "lock" },
    { id: "3", question: t("faq.cancelAnytime.question"), answer: t("faq.cancelAnytime.answer"), icon: "close-circle" },
  ], []);

  return (
    <SafeAreaView style={styles.container} edges={offlineBannerVisible ? [] : ["top"]}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="chevron-left" size={38} color="#FFFFFF" />
      </Pressable>
      <Text style={styles.title}>{t("faq.title")}</Text>
      <Text style={styles.subtitle}>{t("faq.subtitle")}</Text>
      <View style={styles.list}>
        {faqs.map((faq, i) => {
          const isOpen = open === faq.id;
          return (
            <View key={faq.id} style={[styles.item, i < faqs.length - 1 && styles.itemBorder]}>
              <Pressable style={styles.trigger} onPress={() => setOpen(isOpen ? null : faq.id)}>
                <MaterialCommunityIcons name={faq.icon as any} size={20} color="#A9AEC0" />
                <Text style={styles.question}>{faq.question}</Text>
                <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#A9AEC0" />
              </Pressable>
              {isOpen ? <Text style={styles.answer}>{faq.answer}</Text> : null}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#02060E", paddingHorizontal: 24, paddingTop: 12 },
  backBtn: { marginBottom: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#A9AEC0", fontSize: 12, marginBottom: 24 },
  list: { backgroundColor: "#101928", borderRadius: 10, borderWidth: 1, borderColor: "#26344C", overflow: "hidden" },
  item: { overflow: "hidden" },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: "#26344C" },
  trigger: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  question: { color: "#FFFFFF", fontSize: 14, fontWeight: "600", flex: 1 },
  answer: { color: "#A9AEC0", fontSize: 12, lineHeight: 20, paddingHorizontal: 16, paddingBottom: 16, paddingLeft: 48 },
});
