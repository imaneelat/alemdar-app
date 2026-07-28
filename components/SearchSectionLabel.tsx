import { Text } from "react-native"

type Props = {
  label: string
  subtext: string
  marginBottom?: number
}

export function SearchSectionLabel({ label, subtext, marginBottom = 12 }: Props) {
  return (
    <Text style={{
      fontSize: 13, fontWeight: "700", color: subtext,
      letterSpacing: 0.8, textTransform: "uppercase", marginBottom,
    }}>
      {label}
    </Text>
  )
}