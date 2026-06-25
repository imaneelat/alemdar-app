import { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  'Solar', 'Electronics', 'Arduino', 'Sound', 'Chargers',
  'Adapters', 'Lamps', 'Filaments', 'TV Remotes', 'Mexxsun',
  'Fans', 'Electric', 'Spray & Gum', 'Screwdrivers',
];



const INITIAL_RECENT = ['arduino uno', 'esp32', 'servo motor', 'lcd display'];

const popularSearches = [
  'Arduino Uno R4', 'Esp32 Dev Kit', 'Raspberry Pi 4',
  'OLED Display', 'DHT22 Sensor', 'Jumper Wires',
];

const filterCategories = [
  'Arduino', 'ESP32', 'Sensors', 'Solar', 'Modules', 'Boards', 'Components',
];

const brands = ['Arduino', 'Espressif', 'Raspberry', 'ToMaTeD', 'Seeed'];

const brandEmoji: Record<string, string> = {
  Arduino: '.', Espressif: '.', Raspberry: '.', ToMaTeD: '.', Seeed: '.',
};

const sortOptions = [
  'Popularity',
  'Price: Low → High',
  'Price: High → Low',
  'New Arrivals',
];

const getCategoryProducts = (categoryName: string) => ([
  { id: '0', name: `${categoryName} Product 1`, price: '$29.99', description: `Sample ${categoryName} product` },
  { id: '1', name: `${categoryName} Product 2`, price: '$49.99', description: `Another ${categoryName} product` },
]);

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // ── State
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedFilterCat, setSelectedFilterCat] = useState('Arduino');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [availability, setAvailability] = useState<'all' | 'instock' | 'outofstock'>('instock');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [priceRange, setPriceRange] = useState([160, 2500]);

  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['88%'], []);

  // ── Theme tokens
  const t = {
    bg:       isDark ? '#0A0A0A' : '#F5F5F5',
    border:   isDark ? '#2A2A2A' : '#E8E8E8',
    text:     isDark ? '#FFFFFF' : '#111111',
    subtext:  '#888888',
    inputBg:  isDark ? '#1A1A1A' : '#FFFFFF',
    chipBg:   isDark ? '#252525' : '#EFEFEF',
    chipText: isDark ? '#CCCCCC' : '#444444',
    accent:   '#F97316',
    sheet:    isDark ? '#161616' : '#FFFFFF',
    sheetBg:  isDark ? '#1E1E1E' : '#F5F5F5',
  };

  // ── Derived
  const filtered = categories.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase())
  );
  const isSearching = query.length > 0;

  //  Focus → auto opn keyboard
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => inputRef.current?.focus(), 100);
    }, [])
  );

  //  Handlers
  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-detail',
      params: {
        categoryName,
    
        products: JSON.stringify(getCategoryProducts(categoryName)),
      },
    });
  };

  const saveSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 10));
  };

  const handleCancel = () => {
    setQuery('');
    inputRef.current?.blur();
  };

  const openFilter  = () => bottomSheetRef.current?.expand();
  const closeFilter = () => bottomSheetRef.current?.close();

  const resetFilters = () => {
    setSelectedFilterCat('Arduino');
    setSelectedBrand(null);
    setAvailability('all');
    setSelectedSort('Popularity');
    setPriceRange([160, 2500]);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Search Bar ── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, marginTop: 12, marginBottom: 8, gap: 10,
      }}>
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center',
          backgroundColor: t.inputBg, borderRadius: 14,
          paddingHorizontal: 14, height: 48,
          borderWidth: 1, borderColor: t.border,
        }}>
          <Ionicons name="search" size={18} color={t.subtext} style={{ marginRight: 10 }} />
          <TextInput
            ref={inputRef}
            style={{ flex: 1, fontSize: 15, color: t.text }}
            placeholder="Search products, categories..."
            placeholderTextColor={t.subtext}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveSearch(query)}
            returnKeyType="search"
          />
          {/* Filter trigger inside bar */}
          <TouchableOpacity onPress={openFilter} style={{ marginLeft: 8 }}>
            <Ionicons name="options-outline" size={20} color={t.accent} />
          </TouchableOpacity>
        </View>

        {/* Cancel */}
        <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
          <Text style={{ color: t.accent, fontSize: 15, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      <FlatList
        data={isSearching ? filtered : []}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"

        ListHeaderComponent={
          !isSearching ? (
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Recent Searches */}
              <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{
                    fontSize: 13, fontWeight: '700', color: t.subtext,
                    letterSpacing: 0.8, textTransform: 'uppercase',
                  }}>
                    Recent Searches
                  </Text>
                  {recentSearches.length > 0 && (
                    <TouchableOpacity onPress={() => setRecentSearches([])}>
                      <Text style={{ fontSize: 13, color: t.accent, fontWeight: '600' }}>Clear all</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {recentSearches.length === 0 ? (
                  <Text style={{ color: t.subtext, fontSize: 13 }}>No recent searches</Text>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {recentSearches.map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setQuery(item)}
                        style={{
                          flexDirection: 'row', alignItems: 'center', gap: 6,
                          backgroundColor: t.chipBg, borderRadius: 20,
                          paddingHorizontal: 14, paddingVertical: 8,
                        }}
                      >
                        <Ionicons name="time-outline" size={14} color={t.subtext} />
                        <Text style={{ color: t.chipText, fontSize: 13 }}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Popular Searches */}
              <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
                <Text style={{
                  fontSize: 13, fontWeight: '700', color: t.subtext,
                  letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
                }}>
                  Popular Searches
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {popularSearches.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => { setQuery(item); saveSearch(item); }}
                      style={{
                        backgroundColor: t.chipBg, borderRadius: 20,
                        paddingHorizontal: 14, paddingVertical: 8,
                        borderWidth: 1, borderColor: t.border,
                      }}
                    >
                      <Text style={{ color: t.chipText, fontSize: 13 }}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </ScrollView>
          ) : (
            <Text style={{ color: t.subtext, fontSize: 13, paddingHorizontal: 16, paddingTop: 12 }}>
              {filtered.length} results for "{query}"
            </Text>
          )
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row', alignItems: 'center',
              paddingHorizontal: 16, paddingVertical: 12,
              backgroundColor: t.bg, gap: 14,
            }}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 12,
              
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: '#F97316', fontWeight: '700', fontSize: 17 }}>
                {item.charAt(0)}
              </Text>
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: t.text }}>{item}</Text>
            <Ionicons name="chevron-forward" size={16} color={t.subtext} />
          </TouchableOpacity>
        )}

        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: t.border, marginLeft: 74 }} />
        )}

        ListEmptyComponent={() =>
          isSearching ? (
            <View style={{ alignItems: 'center', marginTop: 80, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={{ color: t.subtext, fontSize: 15 }}>No results for "{query}"</Text>
              <Text style={{ color: t.subtext, fontSize: 13 }}>Try a different keyword</Text>
            </View>
          ) : null
        }
      />

      {/* ── Filter Bottom Sheet ── */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: t.sheet }}
        handleIndicatorStyle={{ backgroundColor: t.border, width: 40 }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{
            fontSize: 18, fontWeight: '700', color: t.text,
            marginBottom: 24, textAlign: 'center',
          }}>
            Filters
          </Text>

          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="grid-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {filterCategories.map((cat) => {
                  const active = selectedFilterCat === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedFilterCat(cat)}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: 4,
                        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                        backgroundColor: active ? t.accent : t.sheetBg,
                        borderWidth: 1, borderColor: active ? t.accent : t.border,
                      }}
                    >
                      {active && <Ionicons name="checkmark" size={13} color="#fff" />}
                      <Text style={{ color: active ? '#fff' : t.chipText, fontSize: 13, fontWeight: '500' }}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {/* More chip */}
                <TouchableOpacity style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: t.sheetBg, borderWidth: 1, borderColor: t.border,
                }}>
                  <Text style={{ color: t.chipText, fontSize: 13, fontWeight: '500' }}>More</Text>
                  <Ionicons name="chevron-down" size={12} color={t.chipText} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Brands */}
          <View style={{ marginBottom: 24 }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="pricetag-outline" size={16} color={t.accent} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>Brands</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 13, color: t.accent }}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {brands.map((brand) => {
                  const active = selectedBrand === brand;
                  return (
                    <TouchableOpacity
                      key={brand}
                      onPress={() => setSelectedBrand(active ? null : brand)}
                      style={{
                        width: 64, height: 64, borderRadius: 12,
                        backgroundColor: t.sheetBg,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: active ? t.accent : t.border,
                      }}
                    >
                      <Text style={{ fontSize: 20, marginBottom: 2 }}>{brandEmoji[brand]}</Text>
                      <Text style={{ fontSize: 9, fontWeight: '600', color: t.text, textAlign: 'center' }}>
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Price Range */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Ionicons name="cash-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>Price Range</Text>
            </View>
            <Text style={{ fontSize: 13, color: t.subtext, marginBottom: 8 }}>
              {priceRange[0]} TL – {priceRange[1]} TL
            </Text>
            <MultiSlider
              values={[priceRange[0], priceRange[1]]}
              min={0}
              max={5000}
              step={10}
              onValuesChange={(vals) => setPriceRange(vals)}
              sliderLength={SCREEN_WIDTH - 80}
              selectedStyle={{ backgroundColor: t.accent }}
              unselectedStyle={{ backgroundColor: t.border }}
              markerStyle={{
                backgroundColor: t.accent,
                width: 22, height: 22, borderRadius: 11,
                borderWidth: 3, borderColor: '#fff',
                shadowColor: '#000', shadowOpacity: 0.2,
                shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
              }}
              containerStyle={{ alignSelf: 'center' }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
              <Text style={{ fontSize: 11, color: t.subtext }}>0 TL</Text>
              <Text style={{ fontSize: 11, color: t.subtext }}>5000 TL</Text>
            </View>
          </View>

          {/* Availability */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>Availability</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['all', 'instock', 'outofstock'] as const).map((opt) => {
                const active = availability === opt;
                const label = opt === 'all' ? 'All' : opt === 'instock' ? 'In Stock' : 'Out of Stock';
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setAvailability(opt)}
                    style={{
                      flex: 1, paddingVertical: 10, borderRadius: 10,
                      backgroundColor: active ? t.accent : t.sheetBg,
                      borderWidth: 1, borderColor: active ? t.accent : t.border,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: active ? '#fff' : t.chipText, fontSize: 13, fontWeight: '500' }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sort By */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="swap-vertical-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>Sort By</Text>
            </View>
            {sortOptions.map((opt) => {
              const active = selectedSort === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedSort(opt)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}
                >
                  <View style={{
                    width: 18, height: 18, borderRadius: 9,
                    borderWidth: 2, borderColor: active ? t.accent : t.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.accent }} />
                    )}
                  </View>
                  <Text style={{ color: active ? t.accent : t.text, fontSize: 14, fontWeight: active ? '600' : '400' }}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={resetFilters}
              style={{
                flex: 1, height: 50, borderRadius: 14,
                borderWidth: 1, borderColor: t.border,
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row', gap: 6,
              }}
            >
              <Ionicons name="refresh-outline" size={16} color={t.text} />
              <Text style={{ color: t.text, fontWeight: '600' }}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeFilter}
              style={{
                flex: 2, height: 50, borderRadius: 14,
                backgroundColor: t.accent,
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row', gap: 6,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Apply Filters</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

        </BottomSheetScrollView>
      </BottomSheet>

    </SafeAreaView>
  );
}



