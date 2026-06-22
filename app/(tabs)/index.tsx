import {
  StyleSheet, ScrollView, TouchableOpacity, useColorScheme,
  Image, FlatList, Dimensions, View as RNView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

const { width: W } = Dimensions.get('window');

const carouselData = [
  { id: '1', title: 'TOMMATECH', subtitle: 'GERMAN-based company', description: 'Power Everywhere, Every Day', product: 'XS-500-F', bgColor: '#113470' },
  { id: '2', title: 'Alemdar Teknik', subtitle: 'Robotics, Electronics & Software Lab', description: 'Development · Prototyping · Engineering Solutions', product: '', bgColor: '#1a5276' },
  { id: '3', title: 'TOMMATECH', subtitle: 'GERMAN-BASED COMPANY', description: 'Quality Engineering Solutions', product: '', bgColor: '#0e65e7' },
];

const categories = [
  { id: '1',  name: 'Solar',        description: 'Panels & inverters' },
  { id: '2',  name: 'Electronics',  description: 'Daily essentials' },
  { id: '3',  name: 'Arduino',     description: 'Boards & modules' },
  { id: '4',  name: 'Sound',        description: 'Speakers & mixers' },
  { id: '5',  name: 'Batteries',    description: 'Power storage' },
  { id: '6',  name: 'Chargers',     description: 'Power adapters' },
  { id: '7',  name: 'Adapters',     description: 'Converters' },
  { id: '8',  name: 'Lamps',       description: 'Lighting' },
  { id: '9',  name: 'Mexxsun',     description: 'Energy products' },
  { id: '10', name: 'Filament',    description: '3D printing' },
  { id: '11', name: 'TV Remotes',  description: 'Remote controls' },
  { id: '12', name: 'Fans',        description: 'Cooling systems' },
  { id: '13', name: 'Electrical',  description: 'Electrical tools' },
  { id: '14', name: 'Screwdrivers',description: 'Hand tools' },
  { id: '15', name: 'Spray & Gum', description: 'Spray & adhesive' },
];

// Best Sellers Products
const products = [
  { name: 'HC-SR04 Ultra Sonic Sensor', price: '232.22 TL' },
  { name: 'Arduino Uno R3 SMD CH340 Development Board', price: '836.01 TL' },
  { name: 'Arduino IR Receiver - Transmitter Module', price: '278.67 TL' },
  { name: 'MG996 Metal Servo Motor', price: '557.34 TL' },
  { name: 'Large Breadboard 830', price: '371.56 TL' },
  { name: 'L298 DC ve Step Motor Sürücü Modülü', price: '371.56 TL' },
  { name: 'Mini Breadboard', price: '139.34 TL' },
  { name: 'Arduino Buzzer Board / Module', price: '139.34 TL' },
  { name: 'JUMPER WIRES (Male-Male) (Female-Female)', price: '6.50 TL' },
  { name: 'ESP32-WROOM-32D Wifi Bluetooth Module', price: '11,468.68 TL' },
  { name: 'ESP32-WROOM-32U Wifi Bluetooth Module', price: '1,021.79 TL' },
  { name: 'DHT11 Arduino Temperature and Humidity Sensor', price: '278.67 TL' },
  { name: 'Lm2596 Dc-Dc Adjustable Voltage Step Down', price: '185.78 TL' },
  { name: 'Medium Breadboard', price: '278.67 TL' },
  { name: 'Arduino Nano Clone-USB CH340 Chip', price: '743.12 TL' },
  { name: '18650 Lithium-Ion Battery Slot - 3 Channels', price: '185.78 TL' },
  { name: '5V 2 Channel Relay Board', price: '278.67 TL' },
  { name: 'Rc522 RFID TAG READER 13.56 Mhz', price: '371.56 TL' },
];

// Chargers Category Products
const chargerProducts = [
  { name: '8 Lithium Battery Charger 20V 1.2A XIAOMI MOP 2SROBOT VACUUM CLEANER', price: '1,486.78 TL', stock: 'Only 1 left' },
  { name: 'PMR-988 4.2V 2X1200MA Battery Charger', price: '464.62 TL', stock: 'Only 3 left' },
  { name: 'PMR-WO13 4.2V 650mA Battery Charger', price: '232.31 TL', stock: 'Only 1 left' },
  { name: 'NITECORE INTELLICHARGER NEW 14', price: '3,763.42 TL', stock: 'Only 1 left' },
  { name: 'BEKO 25 - 29V 500mA Upright Vacuum Cleaner Charger', price: '2,090.79 TL', stock: 'Only 1 left' },
  { name: 'NITECORE INTELLICHARGER NEW 4', price: '3,763 TL', stock: 'Only 1 left' },
  { name: 'BEKO 25 - 29V 500mA Upright Vacuum Cleaner Charger -', price: '2,090 TL' },
  { name: 'XIAOMI 25.8V 0.6A LEXY JIMMY VERTICAL VACUUM CLEANER', price: '1,858 TL' },
  { name: 'BEKO 27V 0.5A VERTICAL VACUUM CLEANER CHARGER', price: '1,858 TL' },
  { name: 'Bosch Mijia 30V 1.1A Upright Vacuum Cleaner Charger', price: '1,858 TL', stock: 'Only 3 left' },
  { name: 'SMART BATTERY CHARGER', price: '1,533 TL' },
];

// Adapters Category Products
const adapterProducts = [
  { name: '15 VOLT TRANSFORMER-POWERED CORDLESS DRILL', price: '696.93 TL' },
  { name: '5.99V 2A ADAPTER', price: '557.54 TL' },
  { name: '5V 2A WEKO WALL-MOUNTED ADAPTER', price: '464.62 TL' },
  { name: '9V 2.5A Adaptor', price: '464.62 TL' },
  { name: '21590 8.4V 1A ADAPTOR', price: '464.62 TL' },
  { name: '20V 1A ADAPTOR WEKO', price: '464.62 TL' },
  { name: '9V 3A ADAPTOR', price: '418.16 TL', stock: 'Only 2 left' },
  { name: '3.6V 1A Shaver Charger Adapter', price: '348.47 TL', stock: 'Only 1 left' },
  { name: '4.2V 0.6A Shaver Charger Adapter', price: '348.47 TL', stock: 'Only 2 left' },
  { name: '6V 0.12 Shaver Charger Adapter', price: '348.47 TL', stock: 'Only 3 left' },
  { name: '6V 1.67A ADAPTOR', price: '325.23 TL' },
  { name: '7.2V 2A WEKO POWER ADAPTOR', price: '325.23 TL' },
];

const LANGS = [
  { code: 'EN', flag: '🇬🇧' },
  { code: 'TR', flag: '🇹🇷' },
];
const CURRENCIES = [
  { code: 'TRY', symbol: '₺' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
];

export default function TabOneScreen() {
  const isDark = useColorScheme() === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [lang, setLang]           = useState('EN');
  const [currency, setCurrency]   = useState('TRY');
  const [showLang, setShowLang]   = useState(false);
  const [showCurr, setShowCurr]   = useState(false);

  const bg      = isDark ? '#000' : '#f2f2f7';
  const cardBg  = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subText   = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  useEffect(() => {
    const t = setInterval(() => {
      const next = (currentIndex + 1) % carouselData.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    }, 4000);
    return () => clearInterval(t);
  }, [currentIndex]);

  const handleScroll = (e: any) =>
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / W));

  const closeAll = () => { setShowLang(false); setShowCurr(false); };

  const currentFlag = LANGS.find(l => l.code === lang)?.flag;
  const currentSymbol = CURRENCIES.find(c => c.code === currency)?.symbol;

  const renderCarouselItem = ({ item }: { item: typeof carouselData[0] }) => (
    <View style={[styles.slide, { width: W, backgroundColor: item.bgColor }]}>
      <RNView style={styles.slideContent}>
        <RNView style={styles.slideBrand}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          {item.subtitle && <Text style={styles.slideSub}>{item.subtitle}</Text>}
        </RNView>
        <RNView style={styles.slideInfo}>
          {item.description && <Text style={styles.slideDesc}>{item.description}</Text>}
          {item.product && (
            <RNView style={{ marginTop: 8 }}>
              <Text style={styles.slideProductLabel}>Product</Text>
              <Text style={styles.slideProductName}>{item.product}</Text>
            </RNView>
          )}
        </RNView>
        <TouchableOpacity style={styles.slideBtn}>
          <Text style={styles.slideBtnText}>View Details</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </RNView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} onScrollBeginDrag={closeAll}>

        {/* ── Header ── */}
        <View style={[styles.header, { backgroundColor: '#1a3a6b' }]}>
          {/* Logo */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'transparent' }}>
            <Image
              source={{ uri: 'https://alemdarteknik.com/wp-content/uploads/2021/01/alemdar-logo.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={[styles.logo, { color: '#fff' }]}>Alemdar Teknik</Text>
              <Text style={[styles.logoSub, { color: 'rgba(255,255,255,0.6)' }]}>Lefkoşa, KKTC</Text>
            </View>
          </View>

          {/* Controls */}
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>

            {/* Language */}
            <RNView style={{ position: 'relative' }}>
              <TouchableOpacity
                style={styles.selectorBtn}
                onPress={() => { setShowLang(!showLang); setShowCurr(false); }}
              >
                <Text style={styles.selectorFlag}>{currentFlag}</Text>
                <Text style={styles.selectorText}>{lang}</Text>
                <Text style={styles.selectorChevron}>▾</Text>
              </TouchableOpacity>
              {showLang && (
                <RNView style={styles.dropdown}>
                  {LANGS.map(l => (
                    <TouchableOpacity
                      key={l.code}
                      style={styles.dropdownItem}
                      onPress={() => { setLang(l.code); setShowLang(false); }}
                    >
                      <Text style={styles.selectorFlag}>{l.flag}</Text>
                      <Text style={styles.dropdownLabel}>{l.code}</Text>
                      {lang === l.code && <Ionicons name="checkmark" size={14} color="#1a3a6b" style={{ marginLeft: 'auto' }} />}
                    </TouchableOpacity>
                  ))}
                </RNView>
              )}
            </RNView>

            {/* Currency */}
            <RNView style={{ position: 'relative' }}>
              <TouchableOpacity
                style={styles.selectorBtn}
                onPress={() => { setShowCurr(!showCurr); setShowLang(false); }}
              >
                <Text style={styles.selectorText}>{currentSymbol} {currency}</Text>
                <Text style={styles.selectorChevron}>▾</Text>
              </TouchableOpacity>
              {showCurr && (
                <RNView style={[styles.dropdown, { right: 0, left: undefined }]}>
                  {CURRENCIES.map(c => (
                    <TouchableOpacity
                      key={c.code}
                      style={styles.dropdownItem}
                      onPress={() => { setCurrency(c.code); setShowCurr(false); }}
                    >
                      <Text style={[styles.dropdownLabel, { fontWeight: '700' }]}>{c.symbol}</Text>
                      <Text style={styles.dropdownLabel}>{c.code}</Text>
                      {currency === c.code && <Ionicons name="checkmark" size={14} color="#1a3a6b" style={{ marginLeft: 'auto' }} />}
                    </TouchableOpacity>
                  ))}
                </RNView>
              )}
            </RNView>

            <Ionicons name="cart-outline" size={26} color="#fff" />
          </RNView>
        </View>

        {/* ── Categories ── */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { 
                backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                borderColor: isDark ? '#333' : '#e0e0e0',
              }]}
            >
              <Text style={[styles.categoryName, { color: textColor }]}>{cat.name}</Text>
              <Text style={[styles.categoryDesc, { color: subText }]}>{cat.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Carousel ── */}
        <View style={styles.carouselWrap}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={item => item.id}
            renderItem={renderCarouselItem}
            getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
          />
          <View style={styles.dots}>
            {carouselData.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, {
                  backgroundColor: i === currentIndex ? '#113470' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                  width: i === currentIndex ? 24 : 8,
                }]}
              />
            ))}
          </View>
        </View>

        {/* ── Best Sellers ── */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 16 }]}>Best Sellers</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.bestSellersContainer}
        >
          {products.map((p) => (
            <View key={p.name} style={[styles.productCard, { backgroundColor: cardBg }]}>
              <View style={[styles.productImgBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                <Text style={{ fontSize: 32 }}>📦</Text>
              </View>
              <Text style={[styles.productName, { color: textColor }]} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={styles.productPrice}>{p.price}</Text>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* ── Chargers Category ── */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 16 }]}>Chargers</Text>
        <Text style={[styles.categoryDescription, { color: subText }]}>
          Power adapters and charging essentials for daily devices.
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chargersContainer}
        >
          {chargerProducts.map((p) => (
            <View key={p.name} style={[styles.chargerCard, { backgroundColor: cardBg }]}>
              <View style={[styles.chargerImgBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                <Text style={{ fontSize: 32 }}>🔌</Text>
              </View>
              <Text style={[styles.chargerName, { color: textColor }]} numberOfLines={2}>
                {p.name}
              </Text>
              {p.stock && (
                <Text style={[styles.stockText, { color: '#e74c3c' }]}>{p.stock}</Text>
              )}
              <Text style={styles.chargerPrice}>{p.price}</Text>
              <TouchableOpacity style={styles.chargerAddBtn}>
                <Text style={styles.chargerAddBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* ── Adapters Category ── */}
        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 16 }]}>Adapters</Text>
        <Text style={[styles.categoryDescription, { color: subText }]}>
          Power adapters and converters for everyday electronics.
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.adaptersContainer}
        >
          {adapterProducts.map((p) => (
            <View key={p.name} style={[styles.adapterCard, { backgroundColor: cardBg }]}>
              <View style={[styles.adapterImgBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                <Text style={{ fontSize: 32 }}>🔌</Text>
              </View>
              <Text style={[styles.adapterName, { color: textColor }]} numberOfLines={2}>
                {p.name}
              </Text>
              {p.stock && (
                <Text style={[styles.stockText, { color: '#e74c3c' }]}>{p.stock}</Text>
              )}
              <Text style={styles.adapterPrice}>{p.price}</Text>
              <TouchableOpacity style={styles.adapterAddBtn}>
                <Text style={styles.adapterAddBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4 },
  logoImage: { width: 36, height: 36, borderRadius: 8 },
  logo: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  logoSub: { fontSize: 10, marginTop: 1 },

  // Language / Currency selectors
  selectorBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 68, justifyContent: 'center' },
  selectorFlag: { fontSize: 15 },
  selectorText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  selectorChevron: { color: 'rgba(255,255,255,0.8)', fontSize: 9 },
  dropdown: { position: 'absolute', top: 38, left: 0, backgroundColor: '#fff', borderRadius: 10, minWidth: 120, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 20, zIndex: 9999 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
  dropdownLabel: { fontSize: 13, color: '#000' },

  // Categories
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12, paddingTop: 8 },
  categoriesContainer: { 
    paddingHorizontal: 16, 
    gap: 12, 
    paddingBottom: 8 
  },
  categoryCard: { 
    width: 150, 
    height: 100, 
    borderRadius: 14, 
    borderWidth: 1, 
    padding: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    elevation: 3,
  },
  categoryName: { 
    fontSize: 16, 
    fontWeight: '700', 
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDesc: { 
    fontSize: 11, 
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // Carousel
  carouselWrap: { marginTop: 8, marginBottom: 8 },
  slide: { height: 280, padding: 24, justifyContent: 'center' },
  slideContent: { flex: 1, justifyContent: 'center' },
  slideBrand: { marginBottom: 16 },
  slideTitle: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  slideSub: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginTop: 2, letterSpacing: 2 },
  slideInfo: { marginBottom: 20 },
  slideDesc: { fontSize: 16, fontWeight: '400', color: 'rgba(255,255,255,0.9)', lineHeight: 24 },
  slideProductLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  slideProductName: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 2 },
  slideBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  slideBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, gap: 8 },
  dot: { height: 8, borderRadius: 4 },

  // Best Sellers
  bestSellersContainer: { 
    paddingHorizontal: 30, 
    gap: 12, 
    paddingBottom: 8 
  },
  productCard: { 
    width: 195, 
    height: 300, 
    borderRadius: 14, 
    overflow: 'hidden', 
    padding: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
    justifyContent: 'space-between',
  },
  productImgBox: { 
    height: 171, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 4 
  },
  productName: { 
    fontSize: 11, 
    fontWeight: '600', 
    textAlign: 'center',
    flexShrink: 1,
    minHeight: 32,
  },
  productPrice: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#f5a623', 
    textAlign: 'center',
    marginVertical: 4,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
    color: '#e74c3c',
  },
  addBtn: { 
    backgroundColor: '#1a3a6b', 
    borderRadius: 8, 
    padding: 8, 
    alignItems: 'center',
    width: '100%',
  },
  addBtnText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '700' 
  },

  // Chargers - Same size as Best Sellers
  chargersContainer: { 
    paddingHorizontal: 30, 
    gap: 12, 
    paddingBottom: 8 
  },
  chargerCard: { 
    width: 195, 
    height: 300, 
    borderRadius: 14, 
    overflow: 'hidden', 
    padding: 14, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
    justifyContent: 'space-between',
  },
  chargerImgBox: { 
    height: 171, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 6 
  },
  chargerName: { 
    fontSize: 11, 
    fontWeight: '600', 
    textAlign: 'center',
    flexShrink: 1,
    minHeight: 32,
  },
  chargerPrice: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#f5a623', 
    textAlign: 'center',
    marginVertical: 4,
  },
  chargerAddBtn: { 
    backgroundColor: '#1a3a6b', 
    borderRadius: 8, 
    padding: 8, 
    alignItems: 'center',
    width: '100%',
  },
  chargerAddBtnText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '700' 
  },

  // Adapters - Same size as Best Sellers and Chargers
  adaptersContainer: { 
    paddingHorizontal: 30, 
    gap: 12, 
    paddingBottom: 8 
  },
  adapterCard: { 
    width: 195, 
    height: 300, 
    borderRadius: 14, 
    overflow: 'hidden', 
    padding: 14, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2,
    justifyContent: 'space-between',
  },
  adapterImgBox: { 
    height: 171, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 6 
  },
  adapterName: { 
    fontSize: 11, 
    fontWeight: '600', 
    textAlign: 'center',
    flexShrink: 1,
    minHeight: 32,
  },
  adapterPrice: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#f5a623', 
    textAlign: 'center',
    marginVertical: 4,
  },
  adapterAddBtn: { 
    backgroundColor: '#1a3a6b', 
    borderRadius: 8, 
    padding: 8, 
    alignItems: 'center',
    width: '100%',
  },
  adapterAddBtnText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '700' 
  },
});