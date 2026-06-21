import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  FlatList,
  Dimensions,
  View as RNView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// Carousel Data
const carouselData = [
  {
    id: '1',
    title: 'TOMMATECH',
    subtitle: 'GERMAN-based company',
    description: 'Power Everywhere, Every Day',
    product: 'XS-500-F',
    bgColor: '#113470',
  },
  {
    id: '2',
    title: 'Alemdar Teknik',
    subtitle: 'Robotics, Electronics & Software Lab',
    description: 'Development · Prototyping · Engineering Solutions',
    product: '',
    bgColor: '#1a5276',
  },
  {
    id: '3',
    title: 'TOMMATECH',
    subtitle: 'GERMAN-BASED COMPANY',
    description: 'Quality Engineering Solutions',
    product: '',
    bgColor: '#0e65e7',
  },
];

const categories = [
  { id: '1', name: 'Solar', icon: '☀️', description: 'Panels & inverters' },
  { id: '2', name: 'Electronics', icon: '💻', description: 'Daily essentials' },
  { id: '3', name: 'Arduino', icon: '🔧', description: 'Boards & modules' },
  { id: '4', name: 'Sound', icon: '🔊', description: 'Speakers & mixers' },
  { id: '5', name: 'Batteries', icon: '🔋', description: 'Power storage' },
  { id: '6', name: 'Chargers', icon: '⚡', description: 'Power adapters' },
  { id: '7', name: 'Adapters', icon: '🔌', description: 'Converters' },
  { id: '8', name: 'Lamps', icon: '💡', description: 'Lighting' },
  { id: '9', name: 'Mexxsun', icon: '🌞', description: 'Energy products' },
  { id: '10', name: 'Filament', icon: '🖨️', description: '3D printing' },
  { id: '11', name: 'TV Remotes', icon: '📺', description: 'Remote controls' },
  { id: '12', name: 'Fans', icon: '🌀', description: 'Cooling systems' },
  { id: '13', name: 'Electrical', icon: '🔌', description: 'Electrical tools' },
  { id: '14', name: 'Screwdrivers', icon: '🔩', description: 'Hand tools' },
  { id: '15', name: 'Spray & Gum', icon: '🧴', description: 'Spray & adhesive' },
];

const products = [
  { name: 'Mexxsun Solar Panel', price: '850 TL' },
  { name: 'TV Remote', price: '267 TL' },
  { name: 'Fan', price: '1500 TL' },
];

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const bg = isDark ? '#000' : '#f2f2f7';
  const cardBg = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subText = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  // Auto-scroll effect
  useEffect(() => {
    let interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const renderCarouselItem = ({ item }: { item: typeof carouselData[0] }) => (
    <View style={[styles.carouselSlide, { width: screenWidth, backgroundColor: item.bgColor }]}>
      <RNView style={styles.carouselContent}>
        {/* Brand Section */}
        <RNView style={styles.carouselBrand}>
          <Text style={styles.carouselBrandTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.carouselBrandSub}>{item.subtitle}</Text>
          )}
        </RNView>

        {/* Product/Description Section */}
        <RNView style={styles.carouselInfo}>
          {item.description && (
            <Text style={styles.carouselDescription}>{item.description}</Text>
          )}
          {item.product && (
            <RNView style={styles.carouselProduct}>
              <Text style={styles.carouselProductLabel}>Product</Text>
              <Text style={styles.carouselProductName}>{item.product}</Text>
            </RNView>
          )}
        </RNView>

        {/* CTA Button */}
        <TouchableOpacity style={styles.carouselButton}>
          <Text style={styles.carouselButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </RNView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
       <View style={[styles.header, { backgroundColor: '#1a3a6b' }]}>
         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'transparent' }}>
           <Image
             source={{ uri: 'https://alemdarteknik.com/wp-content/uploads/2021/01/alemdar-logo.png' }}
             style={styles.logoImage}
             resizeMode="contain"
           />
           <View style={{ backgroundColor: 'transparent' }}>
             <Text style={[styles.logo, { color: '#ffffff' }]}>Alemdar Teknik</Text>
             <Text style={[styles.logoSub, { color: 'rgba(255,255,255,0.6)' }]}>Lefkoşa, KKTC</Text>
           </View>
         </View>
         <Ionicons name="cart-outline" size={26} color="#ffffff" />
       </View>

        {/* Categories - NOW ABOVE CAROUSEL */}
        <Text style={[styles.categoriesTitle, { color: textColor }]}>
          Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} style={[styles.categorySquare, { 
              backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
              borderColor: isDark ? '#333' : '#e0e0e0',
            }]}>
              <View style={styles.categorySquareIcon}>
                <Text style={styles.categorySquareEmoji}>{cat.icon}</Text>
              </View>
              <Text style={[styles.categorySquareName, { color: textColor }]}>{cat.name}</Text>
              <Text style={[styles.categorySquareDescription, { color: subText }]}>{cat.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Carousel - NOW BELOW CATEGORIES */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            renderItem={renderCarouselItem}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />
          
          {/* Dot indicators */}
          <View style={styles.dotContainer}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { 
                    backgroundColor: index === currentIndex ? '#113470' : 
                    isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                    width: index === currentIndex ? 24 : 8,
                  }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Best Sellers */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Best Sellers</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 8 }}
        >
          {products.map((p) => (
            <View key={p.name} style={[styles.productCard, { backgroundColor: cardBg }]}>
              <View style={[styles.productImageBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                <Text style={{ fontSize: 40 }}>📦</Text>
              </View>
              <Text style={[styles.productName, { color: textColor }]}>{p.name}</Text>
              <Text style={[styles.productPrice]}>{p.price}</Text>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Repair Banner */}
        <View style={[styles.repairBanner, {
          backgroundColor: isDark ? '#1a0a00' : '#fff3e0',
          borderColor: isDark ? 'rgba(245,166,35,0.2)' : '#f5a623',
        }]}>
          <Text style={{ fontSize: 32 }}>🔧</Text>
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Text style={[styles.repairTitle, { color: textColor }]}>
              Does it run on electricity?
            </Text>
            <Text style={[styles.repairSub, { color: subText }]}>
              We fix it. Same day service.
            </Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  logoImage: { width: 36, height: 36, borderRadius: 8 },
  logo: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  logoSub: { fontSize: 10, marginTop: 1 },

  // Categories Styles
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingTop: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 32,
    gap: 12,
  },
  categorySquare: {
    width: 140,
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  categorySquareIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#113470',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categorySquareEmoji: {
    fontSize: 28,
  },
  categorySquareName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  categorySquareDescription: {
    fontSize: 10,
    textAlign: 'center',
  },

  // Carousel Styles
  carouselContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  carouselSlide: {
    height: 280,
    padding: 24,
    justifyContent: 'center',
  },
  carouselContent: {
    flex: 1,
    justifyContent: 'center',
  },
  carouselBrand: {
    marginBottom: 16,
  },
  carouselBrandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  carouselBrandSub: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    letterSpacing: 2,
  },
  carouselInfo: {
    marginBottom: 20,
  },
  carouselDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
  },
  carouselProduct: {
    marginTop: 8,
  },
  carouselProductLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  carouselProductName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  carouselButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  carouselButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 16,
  },

  productCard: {
    width: 140,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productImageBox: {
    height: 90,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productName: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#f5a623', marginBottom: 8 },
  addBtn: { backgroundColor: '#1a3a6b', borderRadius: 8, padding: 7, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  repairBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  repairTitle: { fontSize: 13, fontWeight: '700' },
  repairSub: { fontSize: 11, marginTop: 2 },
  callBtn: { backgroundColor: '#f5a623', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  callBtnText: { color: '#000', fontWeight: '700', fontSize: 12 },
});