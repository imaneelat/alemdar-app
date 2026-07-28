import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  label: string
  accent: string
  text: string
  marginBottom?: number
}

export function FilterSectionHeader({ icon, label, accent, text, marginBottom = 12 }: Props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom }}>
      <Ionicons name={icon} size={16} color={accent} />
      <Text style={{ fontSize: 14, fontWeight: "700", color: text }}>
        {label}
      </Text>
    </View>
  )
}