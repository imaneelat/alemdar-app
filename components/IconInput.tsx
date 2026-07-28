import { Ionicons } from "@expo/vector-icons"
import { TextInput, View } from "react-native"

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"]
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address"
  colors: {
    input: string
    border: string
    muted: string
    text: string
  }
}

export function IconInput({ icon, placeholder, value, onChangeText, keyboardType = "default", colors: C }: Props) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center",
      backgroundColor: C.input, borderRadius: 10,
      borderWidth: 1, borderColor: C.border,
      paddingHorizontal: 14,
    }}>
      <Ionicons name={icon} size={16} color={C.muted} style={{ marginRight: 8 }} />
      <TextInput
        style={{ flex: 1, fontSize: 14, color: C.text, paddingVertical: 12 }}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  )
}