 // newest version of the code 
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <Text style={styles.logo}>
          ALEMDAR TEKNIK
        </Text>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>☀️</Text>
            <Text style={styles.categoryText}>Solar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>💡</Text>
            <Text style={styles.categoryText}>Lamps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>🔌</Text>
            <Text style={styles.categoryText}>Adapters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>🔋</Text>
            <Text style={styles.categoryText}>Chargers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>📺</Text>
            <Text style={styles.categoryText}>TV Remotes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>🌬️</Text>
            <Text style={styles.categoryText}>Fans</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Products */}
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <View style={styles.productCard}>
          <Text style={styles.productTitle}>Mexxsun Solar Panel</Text>
        </View>

        <View style={styles.productCard}>
          <Text style={styles.productTitle}>TV Remote</Text>
        </View>

        <View style={styles.productCard}>
          <Text style={styles.productTitle}>Fan</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 25,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  categoryCard: {
    width: '47%',
    height: 130,
    backgroundColor: '#d9d9d9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  categoryEmoji: {
    fontSize: 35,
    marginBottom: 10,
  },

  categoryText: {
    fontSize: 18,
    fontWeight: '600',
  },

  productCard: {
    backgroundColor: '#d9d9d9',
    padding: 25,
    borderRadius: 20,
    marginBottom: 15,
  },

  productTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

