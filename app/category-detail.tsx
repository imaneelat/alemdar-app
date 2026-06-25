import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@/lib/i18n';

export default function CategoryDetail() {
  useLocale();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { categoryName, categoryColor, products } = params;
  const parsedProducts = products ? JSON.parse(products as string) : [];

  const bg        = isDark ? '#000'    : '#f2f2f7';
  const cardBg    = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#fff'    : '#000';
  const subText   = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const separator = isDark ? '#2c2c2e' : '#e5e5e5';

  return (
    <>
      {/* ✅ HIDE the native header bar */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.container, { backgroundColor: bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          
          {/* Category Icon */}
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor as string }]}>
            <Text style={styles.categoryInitial}>
              {(categoryName as string)?.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          {/* Category Name */}
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {categoryName}
          </Text>
        </View>

        {/* Products List */}
        <FlatList
          data={parsedProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.productCard, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
            >
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: textColor }]}>
                  {item.name}
                </Text>
                <Text style={[styles.productDescription, { color: subText }]}>
                  {item.description}
                </Text>
              </View>
              <Text style={[styles.productPrice, { color: categoryColor as string }]}>
                {item.price}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: separator }} />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40, // Push content below status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    marginTop:20,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
});