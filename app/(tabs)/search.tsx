import { CachedImage } from "@/components/CachedImage";
import { useWishlist } from "@/context/WishlistContext";
import { useSearchProducts } from "@/hooks/useSearchProducts";
import { t as i18nT, useLocale } from "@/lib/i18n";
import { resolveImageUrl } from "@/lib/image-url";
import { formatTL } from "@/lib/price";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RangeSlider from "react-native-fast-range-slider";
import { Chip, RadioButton, SegmentedButtons } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import {
  siAdafruit,
  siAmd,
  siApple,
  siArduino,
  siAsus,
  siBosch,
  siBroadcom,
  siDell,
  siEspressif,
  siHp,
  siHuawei,
  siIntel,
  siJbl,
  siRaspberrypi,
} from "simple-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Flatten all products from productSections

type ApiProduct = {
  id: number;
  english_name: string | null;
  turkish_name: string | null;
  price: string | null;
  image_filename: string | null;
  category: string | null;
};

type AvailabilityFilter = "all" | "instock" | "outofstock";

const popularSearches = [
  "Arduino Uno R4",
  "Esp32 Dev Kit",
  "Raspberry Pi 4",
  "OLED Display",
  "DHT22 Sensor",
  "Jumper Wires",
];

const filterCategories = [
  "Arduino",
  "ESP32",
  "Sensors",
  "Solar",
  "Modules",
  "Boards",
  "Components",
];

const brands = [
  "Arduino",
  "Espressif",
  "Raspberry Pi",
  "Adafruit",
  "Apple",
  "Dell",
  "HP",
  "Huawei",
  "ASUS",
  "Intel",
  "AMD",
  "Bosch",
  "Broadcom",
  "JBL",
];

const brandLogos: Record<string, { path: string; hex: string }> = {
  Arduino: siArduino,
  Espressif: siEspressif,
  "Raspberry Pi": siRaspberrypi,
  Adafruit: siAdafruit,
  Apple: siApple,
  Dell: siDell,
  HP: siHp,
  Huawei: siHuawei,
  ASUS: siAsus,
  Intel: siIntel,
  AMD: siAmd,
  Bosch: siBosch,
  Broadcom: siBroadcom,
  JBL: siJbl,
};

function BrandLogo({ brand, size }: { brand: string; size: number }) {
  const icon = brandLogos[brand];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icon.path} fill={`#${icon.hex}`} />
    </Svg>
  );
}

const sortOptionKeys = [
  { key: "Popularity", i18nKey: "search.popularity" },
  { key: "Price: Low → High", i18nKey: "search.priceLowHigh" },
  { key: "Price: High → Low", i18nKey: "search.priceHighLow" },
  { key: "New Arrivals", i18nKey: "search.newArrivals" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchScreen() {
  useLocale();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // ── State
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("instock");
  const [selectedSort, setSelectedSort] = useState("Popularity");
  const [priceRange, setPriceRange] = useState([160, 2500]);

  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["88%"], []);

  //  Theme tokens
  const t: Record<string, string> = {
    bg: isDark ? "#0A0A0A" : "#F5F5F5",
    border: isDark ? "#2A2A2A" : "#E8E8E8",
    text: isDark ? "#FFFFFF" : "#111111",
    subtext: "#888888",
    inputBg: isDark ? "#1A1A1A" : "#FFFFFF",
    chipBg: isDark ? "#252525" : "#EFEFEF",
    chipText: isDark ? "#CCCCCC" : "#444444",
    accent: "#FF6B00",
    sheet: isDark ? "#161616" : "#FFFFFF",
    sheetBg: isDark ? "#1E1E1E" : "#F5F5F5",
    cardBg: isDark ? "#1A1A1A" : "#FFFFFF",
    imageBg: isDark ? "#242424" : "#F0F0F0",
    imagePlaceholder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  };

  // ── Toggle helpers for multi-select
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // ── Derived (live API search)
  const isSearching = query.trim().length > 0;
  const {
    data: searchData,
    isLoading: searchLoading,
    isRefetching: searchRefetching,
    isError: searchError,
    refetch: refetchSearch,
  } = useSearchProducts(query);
  const results = (searchData?.data ?? []) as unknown as ApiProduct[];

  // ── Live filtering + sorting, applied on top of the raw search results
  const filteredResults = useMemo(() => {
    let list = [...results];

    if (selectedCategories.length > 0) {
      list = list.filter((item) =>
        selectedCategories.some(
          (cat) => item.category?.toLowerCase() === cat.toLowerCase(),
        ),
      );
    }

    if (selectedBrands.length > 0) {
      list = list.filter((item) => {
        const name = (
          item.english_name ??
          item.turkish_name ??
          ""
        ).toLowerCase();
        return selectedBrands.some((brand) =>
          name.includes(brand.toLowerCase()),
        );
      });
    }

    list = list.filter((item) => {
      const price = parseFloat(item.price ?? "0");
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedSort === "Price: Low → High") {
      list.sort(
        (a, b) => parseFloat(a.price ?? "0") - parseFloat(b.price ?? "0"),
      );
    } else if (selectedSort === "Price: High → Low") {
      list.sort(
        (a, b) => parseFloat(b.price ?? "0") - parseFloat(a.price ?? "0"),
      );
    }

    return list;
  }, [results, selectedCategories, selectedBrands, priceRange, selectedSort]);

  // ── Focus → auto-open keyboard
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => inputRef.current?.focus(), 100);
      return () => Keyboard.dismiss();
    }, []),
  );

  //  Handlers
  const openProduct = (item: ApiProduct) => {
    const imageUrl = resolveImageUrl(item.image_filename);
    saveSearch(query);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/product-detail",
      params: {
        productId: String(item.id),
        section: "main",
        name: item.english_name ?? item.turkish_name ?? "Product",
        price: item.price ?? "",
        image: imageUrl ?? "",
        category: item.category ?? "",
      },
    });
  };

  const saveSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 10),
    );
  };

  const handleCancel = () => {
    setQuery("");
    inputRef.current?.blur();
  };

  const openFilter = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.present();
  };
  const closeFilter = () => bottomSheetRef.current?.dismiss();

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setAvailability("all");
    setSelectedSort("Popularity");
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
    [],
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ── Search Bar ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginTop: 12,
          marginBottom: 8,
          gap: 10,
        }}
      >
        <Animated.View
          layout={LinearTransition.duration(250)}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: t.inputBg,
            borderRadius: 14,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: t.border,
          }}
        >
          <Ionicons
            name="search"
            size={18}
            color={t.subtext}
            style={{ marginRight: 10 }}
          />
          <TextInput
            ref={inputRef}
            style={{ flex: 1, fontSize: 15, color: t.text }}
            placeholder={i18nT("search.placeholder")}
            placeholderTextColor={t.subtext}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveSearch(query)}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={openFilter} style={{ marginLeft: 8 }}>
            <Ionicons name="options-outline" size={20} color={t.accent} />
          </TouchableOpacity>
        </Animated.View>

        {isSearching && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <TouchableOpacity
              onPress={handleCancel}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text
                style={{ color: t.accent, fontSize: 15, fontWeight: "600" }}
              >
                {i18nT("search.cancel")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* ── Content ── */}
      <FlatList
        data={isSearching ? filteredResults : []}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={isSearching && searchRefetching}
        onRefresh={() => {
          if (isSearching) {
            void refetchSearch();
          }
        }}
        ListHeaderComponent={
          <Animated.View
            key={isSearching ? "results-header" : "idle-header"}
            entering={FadeIn.duration(250)}
            exiting={FadeOut.duration(200)}
          >
            {!isSearching ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Recent Searches */}
                <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: t.subtext,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      {i18nT("search.recentSearches")}
                    </Text>
                    {recentSearches.length > 0 && (
                      <TouchableOpacity onPress={() => setRecentSearches([])}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: t.accent,
                            fontWeight: "600",
                          }}
                        >
                          {i18nT("search.clearAll")}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {recentSearches.length === 0 ? (
                    <Text style={{ color: t.subtext, fontSize: 13 }}>
                      {i18nT("search.noRecent")}
                    </Text>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {recentSearches.slice(0, 8).map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => setQuery(item)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            backgroundColor: t.chipBg,
                            borderRadius: 20,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                          }}
                        >
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={t.subtext}
                          />
                          <Text style={{ color: t.chipText, fontSize: 13 }}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Popular Searches */}
                <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: t.subtext,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {i18nT("search.popularSearches")}
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                  >
                    {popularSearches.map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setQuery(item);
                          saveSearch(item);
                        }}
                        style={{
                          backgroundColor: t.chipBg,
                          borderRadius: 20,
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderWidth: 1,
                          borderColor: t.border,
                        }}
                      >
                        <Text style={{ color: t.chipText, fontSize: 13 }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingTop: 12,
                  paddingBottom: 8,
                }}
              >
                <Text
                  style={{ color: t.text, fontSize: 15, fontWeight: "600" }}
                >
                  {i18nT("search.resultsTitle")}
                </Text>
                <Text style={{ color: t.subtext, fontSize: 13 }}>
                  {searchLoading
                    ? "…"
                    : `${filteredResults.length} ${i18nT("search.results")}`}
                </Text>
              </View>
            )}
          </Animated.View>
        }
        renderItem={({ item }) => {
          const name = item.english_name ?? item.turkish_name ?? "Product";
          const imageUrl = resolveImageUrl(item.image_filename);
          console.log(imageUrl);
          const wishlisted = isWishlisted(String(item.id));
          return (
            <TouchableOpacity
              onPress={() => openProduct(item)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: t.bg,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: t.imageBg,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {imageUrl ? (
                  <CachedImage
                    source={{ uri: imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    recyclingKey={String(item.id)}
                  />
                ) : (
                  <Ionicons name="cube-outline" size={20} color={t.accent} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  style={{ fontSize: 15, fontWeight: "500", color: t.text }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: t.accent,
                    marginTop: 2,
                  }}
                >
                  {formatTL(item.price)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleWishlist({
                    id: String(item.id),
                    name,
                    price: item.price?.split(".")[0] ?? "0",
                    dec: item.price?.split(".")[1]?.slice(0, 2) ?? "00",
                    stock: "In Stock",
                    low: false,
                    sectionId: item.category ?? "main",
                    sectionTitle: item.category ?? "Products",
                    accentColor: "#f5a623",
                  });
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={wishlisted ? "heart" : "heart-outline"}
                  size={20}
                  color={wishlisted ? "#e8375a" : t.subtext}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: t.border, marginLeft: 74 }}
          />
        )}
        ListEmptyComponent={() =>
          isSearching && searchLoading ? (
            <View style={{ alignItems: "center", marginTop: 80, gap: 12 }}>
              <ActivityIndicator size="large" color={t.accent} />
              <Text style={{ color: t.subtext, fontSize: 13 }}>
                Searching...
              </Text>
            </View>
          ) : isSearching ? (
            <View style={{ alignItems: "center", marginTop: 80, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={{ color: t.subtext, fontSize: 15 }}>
                {searchError
                  ? "Search failed. Try again."
                  : `${i18nT("search.noResultsFor")} "${query}"`}
              </Text>
              <Text style={{ color: t.subtext, fontSize: 13 }}>
                {i18nT("search.tryDifferent")}
              </Text>
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: t.text,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {i18nT("search.filters")}
          </Text>

          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Ionicons name="grid-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: t.text }}>
                {i18nT("search.categories")}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {filterCategories.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <Chip
                      key={cat}
                      selected={active}
                      onPress={() => toggleCategory(cat)}
                      mode={active ? "flat" : "outlined"}
                      showSelectedCheck
                      style={{
                        backgroundColor: active ? t.accent : t.sheetBg,
                        borderColor: active ? t.accent : t.border,
                      }}
                      textStyle={{
                        color: active ? "#fff" : t.chipText,
                        fontSize: 13,
                        fontWeight: "500",
                      }}
                    >
                      {cat}
                    </Chip>
                  );
                })}
                <Chip
                  mode="outlined"
                  onPress={() => {}}
                  style={{ backgroundColor: t.sheetBg, borderColor: t.border }}
                  textStyle={{
                    color: t.chipText,
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                  icon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={12}
                      color={t.chipText}
                    />
                  )}
                >
                  {i18nT("search.more")}
                </Chip>
              </View>
            </ScrollView>
          </View>

          {/* Brands — no background color, just logo + border */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="pricetag-outline" size={16} color={t.accent} />
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: t.text }}
                >
                  {i18nT("search.brands")}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {brands.map((brand) => {
                  const active = selectedBrands.includes(brand);
                  return (
                    <TouchableOpacity
                      key={brand}
                      onPress={() => toggleBrand(brand)}
                      style={{
                        width: 70,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 14,
                          backgroundColor: "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: active ? 2 : 1,
                          borderColor: active ? t.accent : t.border,
                        }}
                      >
                        {active && (
                          <View
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              backgroundColor: t.accent,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons name="checkmark" size={10} color="#fff" />
                          </View>
                        )}
                        <BrandLogo brand={brand} size={40} />
                      </View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: active ? t.accent : t.text,
                          textAlign: "center",
                          marginTop: 4,
                          width: 70,
                        }}
                      >
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Ionicons name="cash-outline" size={16} color={t.accent} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: t.text }}>
                {i18nT("search.priceRange")}
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: t.subtext, marginBottom: 8 }}>
              {priceRange[0]} TL – {priceRange[1]} TL
            </Text>
            <View style={{ alignItems: "center" }}>
              <RangeSlider
                min={0}
                max={5000}
                step={10}
                initialMinValue={priceRange[0]}
                initialMaxValue={priceRange[1]}
                width={SCREEN_WIDTH - 80}
                thumbSize={24}
                trackHeight={4}
                minimumDistance={50}
                selectedTrackStyle={{ backgroundColor: t.accent }}
                unselectedTrackStyle={{ backgroundColor: t.border }}
                thumbStyle={{
                  backgroundColor: t.accent,
                  borderWidth: 3,
                  borderColor: "#fff",
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
                pressedThumbStyle={{ transform: [{ scale: 1.15 }] }}
                onValuesChange={(vals: [number, number]) =>
                  setPriceRange([Math.round(vals[0]), Math.round(vals[1])])
                }
                leftThumbAccessibilityLabel="Minimum price"
                rightThumbAccessibilityLabel="Maximum price"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Text style={{ fontSize: 11, color: t.subtext }}>0 TL</Text>
              <Text style={{ fontSize: 11, color: t.subtext }}>5000 TL</Text>
            </View>
          </View>

          {/* Availability */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={t.accent}
              />
              <Text style={{ fontSize: 14, fontWeight: "700", color: t.text }}>
                {i18nT("search.availability")}
              </Text>
            </View>
            <SegmentedButtons
              value={availability}
              onValueChange={(val) =>
                setAvailability(val as AvailabilityFilter)
              }
              theme={{
                colors: {
                  secondaryContainer: t.accent,
                  onSecondaryContainer: "#fff",
                  outline: t.border,
                  onSurface: t.chipText,
                },
              }}
              buttons={[
                { value: "all", label: i18nT("search.all") },
                { value: "instock", label: i18nT("search.inStock") },
                { value: "outofstock", label: i18nT("search.outOfStock") },
              ]}
            />
          </View>

          {/* Sort By */}
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="swap-vertical-outline"
                size={16}
                color={t.accent}
              />
              <Text style={{ fontSize: 14, fontWeight: "700", color: t.text }}>
                {i18nT("search.sortBy")}
              </Text>
            </View>
            <RadioButton.Group
              onValueChange={(val) => setSelectedSort(val)}
              value={selectedSort}
            >
              {sortOptionKeys.map(({ key, i18nKey }) => (
                <RadioButton.Item
                  key={key}
                  label={i18nT(i18nKey)}
                  value={key}
                  color={t.accent}
                  labelStyle={{
                    color: selectedSort === key ? t.accent : t.text,
                    fontSize: 14,
                    fontWeight: selectedSort === key ? "600" : "400",
                    textAlign: "left",
                  }}
                  style={{ paddingHorizontal: 0, paddingVertical: 4 }}
                  position="trailing"
                />
              ))}
            </RadioButton.Group>
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={resetFilters}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: t.border,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Ionicons name="refresh-outline" size={16} color={t.text} />
              <Text style={{ color: t.text, fontWeight: "600" }}>
                {i18nT("search.reset")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeFilter}
              style={{
                flex: 2,
                height: 50,
                borderRadius: 14,
                backgroundColor: t.accent,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                {i18nT("search.applyFilters")}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
