const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  
}

export const getColors = (isDark: boolean) => ({
  bg:     isDark ? "#02060E" : "#FFFFFF",
  panel:  isDark ? "#101928" : "#F5F5F5",
  border: isDark ? "#26344C" : "#E8E8E8",
  text:   isDark ? "#FFFFFF" : "#111111",
  muted:  isDark ? "#A9AEC0" : "#6B6B80",
  input:  isDark ? "#101928" : "#F0F0F5",
  orange: "#FF6B00",
  sheet:  isDark ? "#0D1520" : "#FFFFFF",
})
