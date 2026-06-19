import { StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabOneScreen() {
  return (
     <SafeAreaView style={styles.container}>
      {/* Custom header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ALEMDAR TEKNIK</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text>Welcome to Alemdar Teknik App</Text>
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#113470', // dark blue
    paddingVertical: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
