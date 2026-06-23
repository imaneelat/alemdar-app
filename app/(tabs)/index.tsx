import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Image,
  FlatList,
  Dimensions,
  View as RNView,
  TextInput,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;


// DATA

const bannerSlides = [
  {
    id: '1',
    topLabel: 'Power Your',
    title: 'PROJECTS',
    subtitle: 'Top quality electronics\nfor makers & engineers',
    backgroundColor: '#0e2a5a',
    accentColor: '#f5a623',
  },
  {
    id: '2',
    topLabel: 'Explore',
    title: 'ARDUINO',
    subtitle: 'Boards, modules & sensors\nfor every project',
    backgroundColor: '#0a3d2e',
    accentColor: '#2ecc71',
  },
  {
    id: '3',
    topLabel: 'Power Up',
    title: 'SOLAR',
    subtitle: 'Panels, inverters &\nenergy solutions',
    backgroundColor: '#3a1a00',
    accentColor: '#f5a623',
  },
];

const categories = [
  { id: '1', name: 'Solar',       description: 'Panels & Inverters' },
  { id: '2', name: 'Electronics', description: 'Daily Essentials'   },
  { id: '3', name: 'Arduino',     description: 'Boards & Modules'   },
  { id: '4', name: 'Sound',       description: 'Speakers & Mixers'  },
  { id: '5', name: 'Batteries',   description: 'Power Storage'      },
  { id: '6', name: 'Chargers',    description: 'Power Adapters'     },
  { id: '7', name: 'Adapters',    description: 'Converters'         },
  { id: '9', name: 'TV Remotes',       description: 'Remote Controls' },
  { id: '10', name: 'Fans',       description: 'Cooling Systems'  },
  { id: '11', name: 'Screwdrivers',       description: 'Hand Tools' },
  { id: '12', name: 'Electric',       description: 'Electrical Tools' },
  { id: '13', name: 'Spray Gums',       description: 'Sprays and adhesives' },
  { id: '14', name: 'Mexxsun',       description: 'Energy Products'},
  { id: '15', name: 'Filaments',       description: '3D Printing ' },
];

const brands = [
  { id: '1', name: 'ARDUINO',   dotColor: '#00979d' },
  { id: '2', name: 'ESPRESSIF', dotColor: '#e3342f' },
  { id: '3', name: 'TORRANCE', dotColor: '#c51a4a' },
  { id: '4', name: 'SEED', dotColor: '#113470' },
  { id: '5', name: 'URF',   dotColor: '#f5a623' },
];



// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // colors , adapting to dark and light mode
  const PAGE_BG    = isDark ? '#0d0d0d' : '#f2f2f7';
  const HEADER_BG  = isDark ? '#0d0d0d' : '#ffffff';
  const CARD_BG    = isDark ? '#0B1525' : '#2d262eb3';
  const CAT_BG     = isDark ? '#1a1a1a' : '#2d262eb3';
  const CAT_IMG_BG = isDark ? '#0B1525' : '#0B1525';
  const TEXT       = isDark ? '#ffffff' : '#111111';
  const SUBTEXT    = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER     = isDark ? '#2a2a2a' : '#e8e8ee';
  const ORANGE     = '#f5a623';
  const SEARCH_BG  = isDark ? '#0B1525' : '#f0f0f5';
  const ICON_COLOR = isDark ? '#ffffff' : '#111111';
  const SEARCH_PLACEHOLDER = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const SEARCH_TEXT_COLOR  = isDark ? '#ffffff' : '#111111';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchText, setSearchText]     = useState('');
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % bannerSlides.length;
      bannerRef.current?.scrollToIndex({ index: nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    }, 3500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const onBannerScroll = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
    setCurrentSlide(newIndex);
  };

  // ── Banner Slide ──
  const renderBannerSlide = ({ item }: { item: typeof bannerSlides[0] }) => (
    <RNView
      style={{
        width: SCREEN_WIDTH - 32,
        height: 170,
        borderRadius: 6,
        backgroundColor: item.backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      {/* Left: text + button */}
      <RNView style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>
          {item.topLabel}
        </Text>
        <Text style={{ fontSize: 30, fontWeight: '900', color: item.accentColor, letterSpacing: 1, marginTop: 2 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 16 }}>
          {item.subtitle}
        </Text>
        <TouchableOpacity style={{ marginTop: 12, alignSelf: 'flex-start', backgroundColor: item.accentColor, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}>
          <Text style={{ color: '#000', fontSize: 11, fontWeight: '700' }}>Shop Now →</Text>
        </TouchableOpacity>
      </RNView>

      {/* Right: image placeholder */}
      <RNView style={{ width: 90, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center' }}>No image{'\n'}yet</Text>
      </RNView>
    </RNView>
  );

  // ── Product Card ──
  const renderProductCard = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={{
        width: PRODUCT_CARD_WIDTH,
        backgroundColor: CARD_BG,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 10,
        overflow: 'hidden',
      }}
    >
      {/* Wishlist heart */}
      <TouchableOpacity
        style={{
          position: 'absolute', top: 10, left: 10, zIndex: 1,
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Ionicons name="heart-outline" size={20} color={SUBTEXT} />
      </TouchableOpacity>

      {/* Product image */}
      <RNView style={{ height: 110, borderRadius: 6, backgroundColor: isDark ? '#252525' : '#f5f5fa', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Text style={{ color: SUBTEXT, fontSize: 11 }}>No image yet</Text>
      </RNView>

      <Text style={{ fontSize: 9, color: '#2ecc71', fontWeight: '600', marginBottom: 4 }}>● In Stock</Text>
      <Text style={{ fontSize: 11, fontWeight: '600', color: TEXT, lineHeight: 15, minHeight: 30, marginBottom: 4 }} numberOfLines={2}>
        {item.name}
      </Text>
      <TouchableOpacity style={{ backgroundColor: ORANGE, borderRadius: 6, paddingVertical: 7, alignItems: 'center' }}>
        <Text style={{ color: '#000', fontSize: 10, fontWeight: '700' }}>Shop Now →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // ─────────────────────────────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: HEADER_BG }} edges={['top']}>

      {/* ── 1. HEADER ── */}
      <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: HEADER_BG, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 }}>
        {/* Left: name + location */}
        <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <RNView>
            <Text style={{ fontSize:25, fontWeight: '700', color: TEXT, letterSpacing: 0.3 }}>
              Alemdar <Text style={{ color: ORANGE }}>Teknik</Text>
            </Text>
            <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
              <Ionicons name="location-sharp" size={16} color={ORANGE} />
              <Text style={{ fontSize: 10, color: SUBTEXT }}>Lefkoşa, KKTC</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Right: notification + cart */}
        <RNView style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity style={{ padding: 6 }}>
            <Ionicons name="notifications-outline" size={22} color={ICON_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 6 }}>
            <Ionicons name="cart-outline" size={22} color={ICON_COLOR} />
          </TouchableOpacity>
        </RNView>
      </RNView>

      {/* ── 2. SEARCH BAR ── */}
      <RNView style={{ flexDirection: 'row', gap: 8, backgroundColor: HEADER_BG, paddingHorizontal: 16, paddingBottom: 14 }}>
        <RNView style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: SEARCH_BG, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
          <Ionicons name="search" size={16} color={SEARCH_PLACEHOLDER} style={{ marginRight: 8 }} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search Arduino, modules, sensors..."
            placeholderTextColor={SEARCH_PLACEHOLDER}
            style={{ flex: 1, fontSize: 13, color: SEARCH_TEXT_COLOR }}
          />
        </RNView>
        <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: SEARCH_BG, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="options-outline" size={20} color={ICON_COLOR} />
        </TouchableOpacity>
      </RNView>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView style={{ flex: 1, backgroundColor: PAGE_BG }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8 }}>

        {/* ── 3. BANNER CAROUSEL ── */}
        <RNView style={{ 
           marginHorizontal: 16, 
           borderRadius: 2,
           overflow: 'hidden',
           marginBottom: 4,
        }}>
          <FlatList
            ref={bannerRef}
            data={bannerSlides}
            horizontal
            pagingEnabled={false}
            snapToInterval={SCREEN_WIDTH - 32}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            keyExtractor={item => item.id}
            renderItem={renderBannerSlide}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH - 32, offset: (SCREEN_WIDTH - 32) * index, index })}
          />
          {/* Dots */}
          <RNView style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 10, paddingBottom: 4 }}>
            {bannerSlides.map((_, index) => (
              <RNView key={index} style={{ height: 7, borderRadius: 4, width: index === currentSlide ? 20 : 7, backgroundColor: index === currentSlide ? ORANGE : (isDark ? '#3a3a3a' : '#ccc') }} />
            ))}
          </RNView>
        </RNView>

        {/* ── 4. CATEGORIES ── */}
        <RNView style={{
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          paddingHorizontal: 16,
          marginTop: 10,
          marginBottom: 10 
        }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: TEXT }}>Categories</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: '500', color: ORANGE }}>View All</Text>
          </TouchableOpacity>
        </RNView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12 
        }}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.id} style={{ 
              width: 190,
              borderRadius: 8,
              overflow: 'hidden', 
              backgroundColor: CAT_BG 
            }}>
              {/* Top: image area */}
              <RNView style={{
                height: 75,
                backgroundColor: CAT_IMG_BG,
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>No image yet</Text>
              </RNView>
              {/* Bottom: name + description */}
              <RNView style={{ padding: 12 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 3 }}>{cat.name}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{cat.description}</Text>
              </RNView>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─  FEATURED brands  */}
        <RNView style={{
          flexDirection: 'row', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          paddingHorizontal: 16,
          marginTop: 24,
          marginBottom: 12 
        }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: TEXT }}>Featured Brands</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: '500', color: ORANGE }}>View All</Text>
          </TouchableOpacity>
        </RNView>

       
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
          }}
        >
          {brands.map(brand => (
            <TouchableOpacity 
              key={brand.id} 
              style={{
                width: 80,
                height : 80,
                backgroundColor: CARD_BG,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: BORDER,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',

              }}
            >
             
              <Text style={{
                fontSize: 10,
                fontWeight: '500',
                color: TEXT,
                letterSpacing: 0.5,
              }}>
                {brand.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}
