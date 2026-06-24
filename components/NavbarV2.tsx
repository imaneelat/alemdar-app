import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

type NavbarV2Tint = 'light' | 'dark';
export function NavbarV2Background(tint: NavbarV2Tint = 'dark') {
  return function TabBarBlurBg() {
    return (
      <BlurView
        tint={tint}
        intensity={100}
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
    );
  };
}
export const NAVBAR_V2_STYLE = {
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: 75,
  borderTopWidth: 0,
  borderTopColor: 'transparent',
  elevation: 0,
  shadowOpacity: 0,
};
