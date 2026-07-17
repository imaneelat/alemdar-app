import { ProductCard } from "@/components/ProductCard";
import { useOfflineBannerVisible } from "@/hooks/useOfflineBanner";
import { usePrefetchImages } from "@/hooks/usePrefetchImages";
import { useSectionProducts } from "@/hooks/useSectionProducts";
import { useLocale } from "@/lib/i18n";
import { getSectionMeta } from "@/lib/section-meta";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

export default function CategoryDetail() {
  useLocale();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const params = useLocalSearchParams();
  const offlineBannerVisible = useOfflineBannerVisible();

  const section = (params.section as string) ?? "main";
  const meta = getSectionMeta(section);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useSectionProducts(section, { limit: PAGE_SIZE });

  const products = data?.pages.flatMap((p) => p.data) ?? [];

  usePrefetchImages(products.map((p) => p.image_filename));

  const bg = isDark ? "#000" : "#f2f2f7";
  const textColor = isDark ? "#fff" : "#000";
  const subText = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={[styles.container, { backgroundColor: bg }]}
        edges={offlineBannerVisible ? [] : ["top"]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <View
            style={[styles.categoryIcon, { backgroundColor: meta.accentColor }]}
          >
            <Ionicons name={meta.icon} size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {meta.title}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={meta.accentColor} />
          </View>
        ) : (
          <FlatList
            data={isError ? [] : products}
            keyExtractor={(item) => `${item.section}-${item.id}`}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
            contentContainerStyle={{
              flexGrow: isError || products.length === 0 ? 1 : undefined,
              paddingBottom: 40,
              gap: 12,
            }}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => {
              void refetch();
            }}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <ProductCard
                  product={item}
                  sectionTitle={meta.title}
                  accentColor={meta.accentColor}
                  fluid
                />
              </View>
            )}
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  color={meta.accentColor}
                  style={{ marginVertical: 16 }}
                />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={{ color: subText }}>
                  {isError
                    ? "Couldn't load products. Pull to retry."
                    : "No products in this category."}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  backButton: { padding: 4, marginRight: 8 },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
});
