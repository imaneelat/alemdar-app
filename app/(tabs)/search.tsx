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
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Haptics from 'expo-haptics';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale, t as i18nT } from '@/lib/i18n';
import { useSearchProducts } from '@/hooks/useSearchProducts';
import { formatTL } from '@/lib/price';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Flatten all products from productSections 

type ApiProduct = {
  id: number;
  english_name: string | null;
  turkish_name: string | null;
  price: string | null;
  image_filename: string | null;
  category: string | null;
};

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

const sortOptionKeys = [
  { key: 'Popularity',         i18nKey: 'search.popularity'   },
  { key: 'Price: Low → High',  i18nKey: 'search.priceLowHigh' },
  { key: 'Price: High → Low',  i18nKey: 'search.priceHighLow' },
  { key: 'New Arrivals',       i18nKey: 'search.newArrivals'  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchScreen() {
  useLocale();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // ── State
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedFilterCat, setSelectedFilterCat] = useState('Arduino');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [availability, setAvailability] = useState<'all' | 'instock' | 'outofstock'>('instock');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [priceRange, setPriceRange] = useState([160, 2500]);

  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['88%'], []);

  //  Theme tokens
  const t: Record<string, string> = {
    bg:               isDark ? '#0A0A0A' : '#F5F5F5',
    border:           isDark ? '#2A2A2A' : '#E8E8E8',
    text:             isDark ? '#FFFFFF' : '#111111',
    subtext:          '#888888',
    inputBg:          isDark ? '#1A1A1A' : '#FFFFFF',
    chipBg:           isDark ? '#252525' : '#EFEFEF',
    chipText:         isDark ? '#CCCCCC' : '#444444',
    accent:           '#F97316',
    sheet:            isDark ? '#161616' : '#FFFFFF',
    sheetBg:          isDark ? '#1E1E1E' : '#F5F5F5',
    cardBg:           isDark ? '#1A1A1A' : '#FFFFFF',
    imageBg:          isDark ? '#242424' : '#F0F0F0',
    imagePlaceholder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };

  // ── Derived (live API search)
  const isSearching = query.trim().length > 0;
  const { data: searchData, isLoading: searchLoading, isError: searchError } = useSearchProducts(query);
  const results = (searchData?.data ?? []) as unknown as ApiProduct[];

  // ── Focus → auto-open keyboard
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => inputRef.current?.focus(), 100);
    }, [])
  );

  //  Handlers
  const openProduct = (item: ApiProduct) => {
    saveSearch(query);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/product-detail',
      params: {
        productId: String(item.id),
        section: 'main',
        name: item.english_name ?? item.turkish_name ?? 'Product',
        price: item.price ?? '',
        image: item.image_filename ?? '',
        category: item.category ?? '',
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

  const openFilter  = () => bottomSheetRef.current?.present();
  const closeFilter = () => bottomSheetRef.current?.dismiss();

  const resetFilters = () => {
    setSelectedFilterCat('Arduino');
    setSelectedBrand(null);
    setAvailability('all');
    setSelectedSort('Popularity');
    setPriceRange([160, 2500]);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  // ─────────────────────────────────────────────────────────────────────────────

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
            placeholder={i18nT('search.placeholder')}
            placeholderTextColor={t.subtext}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveSearch(query)}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={openFilter} style={{ marginLeft: 8 }}>
            <Ionicons name="options-outline" size={20} color={t.accent} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
          <Text style={{ color: t.accent, fontSize: 15, fontWeight: '600' }}>{i18nT('search.cancel')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      <FlatList
        data={isSearching ? results : []}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}

        ListHeaderComponent={
          !isSearching ? (
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Recent Searches */}
              <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: t.subtext, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                    {i18nT('search.recentSearches')}
                  </Text>
                  {recentSearches.length > 0 && (
                    <TouchableOpacity onPress={() => setRecentSearches([])}>
                      <Text style={{ fontSize: 13, color: t.accent, fontWeight: '600' }}>{i18nT('search.clearAll')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {recentSearches.length === 0 ? (
                  <Text style={{ color: t.subtext, fontSize: 13 }}>{i18nT('search.noRecent')}</Text>
                ) : (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {recentSearches.map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => setQuery(item)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.chipBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}
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
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.subtext, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
                  {i18nT('search.popularSearches')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {popularSearches.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => { setQuery(item); saveSearch(item); }}
                      style={{ backgroundColor: t.chipBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: t.border }}
                    >
                      <Text style={{ color: t.chipText, fontSize: 13 }}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </ScrollView>
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
              <Text style={{ color: t.text, fontSize: 15, fontWeight: '600' }}>{i18nT('search.resultsTitle')}</Text>
              <Text style={{ color: t.subtext, fontSize: 13 }}>
                {searchLoading ? '…' : `${results.length} ${i18nT('search.results')}`}
              </Text>
            </View>
          )
        }

        renderItem={({ item }) => {
          const name = item.english_name ?? item.turkish_name ?? 'Product';
          const wishlisted = isWishlisted(String(item.id));
          return (
            <TouchableOpacity
              onPress={() => openProduct(item)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: t.bg, gap: 14 }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: t.chipBg, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="cube-outline" size={20} color={t.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={{ fontSize: 15, fontWeight: '500', color: t.text }}>{name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.accent, marginTop: 2 }}>{formatTL(item.price)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleWishlist({
                    id: String(item.id),
                    name,
                    price: item.price?.split('.')[0] ?? '0',
                    dec: item.price?.split('.')[1]?.slice(0, 2) ?? '00',
                    stock: 'In Stock',
                    low: false,
                    sectionId: item.category ?? 'main',
                    sectionTitle: item.category ?? 'Products',
                    accentColor: '#f5a623',
                  });
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={20} color={wishlisted ? '#e8375a' : t.subtext} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}

        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: t.border, marginLeft: 74 }} />
        )}

        ListEmptyComponent={() =>
          isSearching && !searchLoading ? (
            <View style={{ alignItems: 'center', marginTop: 80, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={{ color: t.subtext, fontSize: 15 }}>
                {searchError ? 'Search failed. Try again.' : `${i18nT('search.noResultsFor')} "${query}"`}
              </Text>
              <Text style={{ color: t.subtext, fontSize: 13 }}>{i18nT('search.tryDifferent')}</Text>
            </View>
          ) : null
        }
      />

      {/* ── Filter Bottom Sheet ── */}
      <BottomSheetModal
        ref={bottomSheetRef}
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
          <Text style={{ fontSize: 18, fontWeight: '700', color: t.text, marginBottom: 24, textAlign: 'center' }}>
            {i18nT('search.filters')}
          </Text>

          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="grid-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{i18nT('search.categories')}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {filterCategories.map((cat) => {
                  const active = selectedFilterCat === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedFilterCat(cat)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: active ? t.accent : t.sheetBg, borderWidth: 1, borderColor: active ? t.accent : t.border }}
                    >
                      {active && <Ionicons name="checkmark" size={13} color="#fff" />}
                      <Text style={{ color: active ? '#fff' : t.chipText, fontSize: 13, fontWeight: '500' }}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: t.sheetBg, borderWidth: 1, borderColor: t.border }}>
                  <Text style={{ color: t.chipText, fontSize: 13, fontWeight: '500' }}>{i18nT('search.more')}</Text>
                  <Ionicons name="chevron-down" size={12} color={t.chipText} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Brands */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="pricetag-outline" size={16} color={t.accent} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{i18nT('search.brands')}</Text>
              </View>
              <TouchableOpacity>
                <Text style={{ fontSize: 13, color: t.accent }}>{i18nT('search.viewAll')}</Text>
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
                      style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: t.sheetBg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: active ? t.accent : t.border }}
                    >
                      <Text style={{ fontSize: 20, marginBottom: 2 }}>{brandEmoji[brand]}</Text>
                      <Text style={{ fontSize: 9, fontWeight: '600', color: t.text, textAlign: 'center' }}>{brand}</Text>
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
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{i18nT('search.priceRange')}</Text>
            </View>
            <Text style={{ fontSize: 13, color: t.subtext, marginBottom: 8 }}>
              {priceRange[0]} TL – {priceRange[1]} TL
            </Text>
            <MultiSlider
              values={[priceRange[0], priceRange[1]]}
              min={0} max={5000} step={10}
              onValuesChange={(vals) => setPriceRange(vals)}
              sliderLength={SCREEN_WIDTH - 80}
              selectedStyle={{ backgroundColor: t.accent }}
              unselectedStyle={{ backgroundColor: t.border }}
              markerStyle={{ backgroundColor: t.accent, width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
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
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{i18nT('search.availability')}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['all', 'instock', 'outofstock'] as const).map((opt) => {
                const active = availability === opt;
                const label = opt === 'all' ? i18nT('search.all') : opt === 'instock' ? i18nT('search.inStock') : i18nT('search.outOfStock');
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setAvailability(opt)}
                    style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: active ? t.accent : t.sheetBg, borderWidth: 1, borderColor: active ? t.accent : t.border, alignItems: 'center' }}
                  >
                    <Text style={{ color: active ? '#fff' : t.chipText, fontSize: 13, fontWeight: '500' }}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sort By */}
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Ionicons name="swap-vertical-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>{i18nT('search.sortBy')}</Text>
            </View>
            {sortOptionKeys.map(({ key, i18nKey }) => {
              const active = selectedSort === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedSort(key)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}
                >
                  <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: active ? t.accent : t.border, alignItems: 'center', justifyContent: 'center' }}>
                    {active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.accent }} />}
                  </View>
                  <Text style={{ color: active ? t.accent : t.text, fontSize: 14, fontWeight: active ? '600' : '400' }}>{i18nT(i18nKey)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={resetFilters}
              style={{ flex: 1, height: 50, borderRadius: 14, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            >
              <Ionicons name="refresh-outline" size={16} color={t.text} />
              <Text style={{ color: t.text, fontWeight: '600' }}>{i18nT('search.reset')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeFilter}
              style={{ flex: 2, height: 50, borderRadius: 14, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{i18nT('search.applyFilters')}</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

        </BottomSheetScrollView>
      </BottomSheetModal>

    </SafeAreaView>
  );
}



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        