import SplashScreen from '@/components/SplashScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function SplashRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SplashScreen />
    </GestureHandlerRootView>
  )
}
