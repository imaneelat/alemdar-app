import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";

type NavbarV2Tint = "light" | "dark";
export function NavbarV2Background(tint: NavbarV2Tint = "dark") {
  return function TabBarBlurBg() {
    if (Platform.OS === "ios") {
      return (
        <BlurView tint={tint} intensity={100} style={StyleSheet.absoluteFill} />
      );
    }

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              tint === "dark"
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(255, 255, 255, 0.92)",
          },
        ]}
      />
    );
  };
}

export const NAVBAR_V2_STYLE = {
  position: "absolute" as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: 75,
  borderTopWidth: 0,
  borderTopColor: "transparent",
  elevation: 0,
  shadowOpacity: 0,
};
