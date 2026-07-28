import { Text } from "@/components/Themed"
import { View } from "react-native"

type Props = {
  title: string
  text: string
  marginTop?: number
}

export function SectionHeader({ title, text, marginTop = 28 }: Props) {
  return (
    <View style={{
      flexDirection: "row", justifyContent: "space-between",
      alignItems: "center", paddingHorizontal: 16,
      marginTop, marginBottom: 12,
    }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: text }}>
        {title}
      </Text>
    </View>
  )
}