import { ProductCard } from "@/components/ProductCard";
import { Text } from "@/components/Themed";
import { usePrefetchImages } from "@/hooks/usePrefetchImages";
import { useSectionProducts } from "@/hooks/useSectionProducts";
import { getSectionMeta } from "@/lib/section-meta";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  View as RNView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type Props = { sectionKey: string; limit?: number };

/** A home-screen carousel for a single section, backed by the live API. */
export function HomeProductSection({ sectionKey, limit = 10 }: Props) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const meta = getSectionMeta(sectionKey);

  const { data, isLoading, isError } = useSectionProducts(sectionKey, {
    limit,
  });
  const products = data?.pages.flatMap((p) => p.data) ?? [];
  usePrefetchImages(products.map((p) => p.image_filename));

  const TEXT = isDark ? "#ffffff" : "#111111";
  const SUBTEXT = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

  if (isError || (!isLoading && products.length === 0)) return null;

  const viewAll = () =>
    router.push({
      pathname: "/category-detail",
      params: { section: sectionKey },
    });

  return (
    <RNView style={{ marginBottom: 32 }}>
      <RNView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingHorizontal: 16,
          marginBottom: 4,
        }}
      >
        <RNView style={{ flex: 1 }}>
          <RNView
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <RNView
              style={{
                width: 4,
                height: 18,
                borderRadius: 2,
                backgroundColor: meta.accentColor,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "700", color: TEXT }}>
              {meta.title}
            </Text>
          </RNView>
          {/* <Text style={{ fontSize: 11, color: SUBTEXT, marginTop: 3, marginLeft: 12 }}>{meta.subtitle}</Text> */}
        </RNView>
        <TouchableOpacity
          onPress={viewAll}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            marginTop: 2,
          }}
        >
          <Text
            style={{ fontSize: 12, fontWeight: "600", color: meta.accentColor }}
          >
            View All
          </Text>
          <Ionicons name="arrow-forward" size={13} color={meta.accentColor} />
        </TouchableOpacity>
      </RNView>

      {isLoading ? (
        <RNView
          style={{
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={meta.accentColor} />
        </RNView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 4,
          }}
        >
          {products.map((p) => (
            <ProductCard
              key={`${p.section}-${p.id}`}
              product={p}
              sectionTitle={meta.title}
              accentColor={meta.accentColor}
            />
          ))}
        </ScrollView>
      )}
    </RNView>
  );
}
