import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type NavbarV2Tint = "light" | "dark";

type NavbarV2Props = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: object }>;
  };
  descriptors: Record<
    string,
    {
      options: {
        tabBarAccessibilityLabel?: string;
        tabBarActiveTintColor?: string;
        tabBarIcon?: (props: {
          focused: boolean;
          color: string;
          size: number;
        }) => ReactNode;
        tabBarInactiveTintColor?: string;
        tabBarLabel?:
          | string
          | ((props: {
              focused: boolean;
              color: string;
              position: "below-icon" | "beside-icon";
              children: string;
            }) => ReactNode);
        tabBarButtonTestID?: string;
        title?: string;
      };
    }
  >;
  insets: { bottom: number };
  navigation: {
    emit: (event: {
      type: "tabPress" | "tabLongPress";
      target: string;
      canPreventDefault?: boolean;
    }) => unknown;
    navigate: (name: string, params?: object) => void;
  };
  tint?: NavbarV2Tint;
};

export function NavbarV2Background(tint: NavbarV2Tint = "dark") {
  return function TabBarBlurBg() {
    if (Platform.OS === "ios") {
      return (
        <BlurView tint={tint} intensity={100} style={StyleSheet.absoluteFill} />
      );
    }

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor:
              tint === "dark"
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(255, 255, 255, 0.92)",
          },
        ]}
      />
    );
  };
}

export function NavbarV2({
  state,
  descriptors,
  insets,
  navigation,
  tint = "dark",
}: NavbarV2Props) {
  const Background = NavbarV2Background(tint);

  return (
    <View
      style={[
        NAVBAR_V2_STYLE,
        {
          // height: NAVBAR_V2_STYLE.height + insets.bottom,
          // paddingBottom: Math.max(insets.bottom, 8),
          // paddingTop: 8,
          paddingBottom: insets.bottom + 16,
          paddingTop: 32,
        },
      ]}
    >
      <Background />
      <View style={styles.items}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused
            ? (options.tabBarActiveTintColor ?? "#FF6B00")
            : (options.tabBarInactiveTintColor ?? "#8A8A9A");
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name);

          return (
            <Pressable
              key={route.key}
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? String(label)
              }
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : undefined}
              testID={options.tabBarButtonTestID}
              onLongPress={() => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              }}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                }) as { defaultPrevented?: boolean };

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={styles.item}
            >
              {options.tabBarIcon?.({ focused, color, size: 30 })}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const NAVBAR_V2_STYLE = {
  // height: 75,
  borderTopWidth: 0,
  borderTopColor: "transparent",
  elevation: 0,
  shadowOpacity: 0,
};

const styles = StyleSheet.create({
  items: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
    borderRadius: 34,
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
});
