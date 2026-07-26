import { useColorScheme } from "react-native";

export function useColors() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { isDark };
}