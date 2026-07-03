import { ProductCard } from "@/components/ProductCard";
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

const PAGE_SIZE = 20;

export default function CategoryDetail() {
  useLocale();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const params = useLocalSearchParams();

  const section = (params.section as string) ?? "main";
  const meta = getSectionMeta(section);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSectionProducts(section, { limit: PAGE_SIZE });

  const products = data?.pages.flatMap((p) => p.data) ?? [];

  usePrefetchImages(products.map((p) => p.image_filename));

  const bg = isDark ? "#000" : "#f2f2f7";
  const textColor = isDark ? "#fff" : "#000";
  const subText = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: bg }]}>
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
        ) : isError ? (
          <View style={styles.center}>
            <Text style={{ color: subText }}>
              Couldn&apos;t load products. Pull to retry.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => `${item.section}-${item.id}`}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
            showsVerticalScrollIndicator={false}
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
                  No products in this category.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
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
    marginTop: 20,
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
