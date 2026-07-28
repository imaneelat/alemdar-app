import * as Haptics from "expo-haptics"
import { Linking, TouchableOpacity } from "react-native"
import { Text } from "@/components/Themed"

type Props = {
  icon: React.ReactNode
  label: string
  url: string
  cardBg: string
  border: string
  text: string
}

export function SocialButton({ icon, label, url, cardBg, border, text }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        Linking.openURL(url)
      }}
      activeOpacity={0.8}
      style={{
        flex: 1, flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 6, paddingVertical: 14, borderRadius: 12,
        backgroundColor: cardBg, borderWidth: 1, borderColor: border,
      }}
    >
      {icon}
      <Text style={{ fontSize: 11, fontWeight: "600", color: text }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}