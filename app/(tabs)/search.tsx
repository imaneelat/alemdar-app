import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router'; // Changed to useRouter
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Category data with just names - super clean and easy to maintain
const categories = [
  'Solar',
  'Electronics',
  'Arduino',
  'Sound',
  'Chargers',
  'Adapters',
  'Lamps',
  'Filaments',
  'TV Remotes',
  'Mexxsun',
  'Fans',
  'Electric',
  'Spray & Gum',
  'Screwdrivers',
];

// Color palette for category icons , later replace them with real pictures from wesbite
const categoryColors: Record<string, string> = {
  'Solar': '#FF6B35',
  'Electronics': '#4A90D9',
  'Arduino': '#00979D',
  'Sound': '#8B5CF6',
  'Chargers': '#10B981',
  'Adapters': '#F59E0B',
  'Lamps': '#FCD34D',
  'Filaments': '#EF4444',
  'TV Remotes': '#6366F1',
  'Mexxsun': '#F97316',
  'Fans': '#06B6D4',
  'Electric': '#8B5CF6',
  'Spray & Gum': '#EC4899',
  'Screwdrivers': '#6B7280',
};

// Sample product data for each category
const categoryProducts: Record<string, Array<{id: string, name: string, price: string, description: string}>> = {
  'Solar': [
    { id: '1', name: 'Solar Panel 100W', price: '$89.99', description: 'High-efficiency monocrystalline solar panel' },
    { id: '2', name: 'Solar Charge Controller', price: '$34.99', description: 'PWM charge controller for solar systems' },
    { id: '3', name: 'Solar Inverter', price: '$199.99', description: 'Pure sine wave inverter for solar power' },
  ],
  'Electronics': [
    { id: '4', name: 'Multimeter', price: '$29.99', description: 'Digital multimeter with auto-ranging' },
    { id: '5', name: 'Oscilloscope', price: '$349.99', description: 'Portable digital oscilloscope' },
    { id: '6', name: 'Power Supply', price: '$79.99', description: 'Adjustable DC power supply' },
  ],
  'Arduino': [
    { id: '7', name: 'Arduino Uno', price: '$24.99', description: 'Original Arduino Uno R3 board' },
    { id: '8', name: 'Arduino Mega', price: '$39.99', description: 'Arduino Mega 2560 with more pins' },
    { id: '9', name: 'Sensor Kit', price: '$49.99', description: '37-in-1 sensor kit for Arduino' },
  ],
};

// Fallback products for categories without data
const getCategoryProducts = (categoryName: string) => {
  return categoryProducts[categoryName] || [
    { id: '0', name: `${categoryName} Product 1`, price: '$29.99', description: `Sample ${categoryName} product` },
    { id: '1', name: `${categoryName} Product 2`, price: '$49.99', description: `Another ${categoryName} product` },
    { id: '2', name: `${categoryName} Product 3`, price: '$79.99', description: `Premium ${categoryName} product` },
  ];
};

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter(); // Use Expo Router's useRouter

  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const bg        = isDark ? '#000'    : '#f2f2f7';
  const cardBg    = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#fff'    : '#000';
  const subText   = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const inputBg   = isDark ? '#1c1c1e' : '#ffffff';
  const separator = isDark ? '#2c2c2e' : '#e5e5e5';

  const filtered = categories.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, [])
  );

  const isSearching = query.length > 0;

  // Get first letter for the icon
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Navigate to category detail page using Expo Router
  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-detail',
      params: {
        categoryName: categoryName,
        categoryColor: categoryColors[categoryName] || '#6B7280',
        products: JSON.stringify(getCategoryProducts(categoryName)),
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Search Bar - Now at the very top */}
      <View style={[styles.searchContainer, { backgroundColor: inputBg }]}>
        <Ionicons name="search" size={18} color={subText} style={{ marginRight: 8 }} />
        <TextInput
          ref={inputRef}
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search for products, categories..."
          placeholderTextColor={isDark ? '#555' : '#aaa'}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={isDark ? '#555' : '#aaa'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results / Categories List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultRow, { backgroundColor: cardBg }]}
            activeOpacity={0.7}
            onPress={() => handleCategoryPress(item)}
          >
            {/* Colorful Icon Box */}
            <View style={[
              styles.iconBox, 
              { backgroundColor: categoryColors[item] || '#6B7280' }
            ]}>
              <Text style={styles.iconText}>{getInitial(item)}</Text>
            </View>

            {/* Name */}
            <Text style={[styles.resultText, { color: textColor }]}>{item}</Text>

            {/* Arrow */}
            <Ionicons name="chevron-forward" size={18} color={isDark ? '#444' : '#ccc'} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: separator }} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔍</Text>
            <Text style={[styles.emptyText, { color: subText }]}>
              No results for "{query}"
            </Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
  },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 14,
  },

  iconBox: {
    width: 60,
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  resultText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '500',
  },
});



