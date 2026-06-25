import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  Dimensions,
  View as RNView,
  TextInput,
} from 'react-native';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { productSections } from '@/constants/ProductData';
import { useLocale, t } from '@/lib/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AMBER = '#f5a623';

//  Banner slidess
const bannerSlides = [
  { id: '1', topLabel: 'Power Your',  title: 'PROJECTS',  subtitle: 'Top quality electronics\nfor makers & engineers', backgroundColor: '#0e2a5a', accentColor: AMBER },
  { id: '2', topLabel: 'Explore',     title: 'ARDUINO',   subtitle: 'Boards, modules & sensors\nfor every project',    backgroundColor: '#0a3d2e', accentColor: '#2ecc71' },
  { id: '3', topLabel: 'Power Up',    title: 'SOLAR',     subtitle: 'Panels, inverters &\nenergy solutions',           backgroundColor: '#3a1a00', accentColor: AMBER },
  { id: '4', topLabel: 'Sound Your',  title: 'WORLD',     subtitle: 'Speakers, mixers &\naudio systems',              backgroundColor: '#1a003a', accentColor: '#a855f7' },
];

//categories
const categories = [
  { id: '1',  name: 'Solar',        icon: 'sunny-outline',            color: '#f5a623' },
  { id: '2',  name: 'Electronics',  icon: 'flash-outline',            color: '#2ecc71' },
  { id: '3',  name: 'Arduino',      icon: 'hardware-chip-outline',    color: '#00979d' },
  { id: '4',  name: 'Sound',        icon: 'musical-notes-outline',    color: '#a855f7' },
  { id: '5',  name: 'Batteries',    icon: 'battery-charging-outline', color: '#e3342f' },
  { id: '6',  name: 'Chargers',     icon: 'phone-portrait-outline',   color: '#3b82f6' },
  { id: '7',  name: 'Adapters',     icon: 'swap-horizontal-outline',  color: '#f5a623' },
  { id: '8',  name: 'Lamps',        icon: 'bulb-outline',             color: '#fbbf24' },
  { id: '9',  name: 'Mexxsun',      icon: 'leaf-outline',             color: '#10b981' },
  { id: '10', name: 'Filaments',    icon: 'layers-outline',           color: '#ec4899' },
  { id: '11', name: 'TV Remotes',   icon: 'tv-outline',               color: '#6366f1' },
  { id: '12', name: 'Fans',         icon: 'thermometer-outline',      color: '#06b6d4' },
  { id: '13', name: 'Electric',     icon: 'construct-outline',        color: '#f97316' },
  { id: '14', name: 'Screwdrivers', icon: 'settings-outline',         color: '#78716c' },
  { id: '15', name: 'Spray Gum',    icon: 'color-fill-outline',       color: '#84cc16' },
];

// brandes
const brands = [
  { id: '1', name: 'ARDUINO',   color: '#00979d' },
  { id: '2', name: 'ESPRESSIF', color: '#e3342f' },
  { id: '3', name: 'MEXXSUN',   color: '#10b981' },
  { id: '4', name: 'WEKO',      color: '#f5a623' },
  { id: '5', name: 'VARTA',     color: '#1d4ed8' },
  { id: '6', name: 'ORION',     color: '#7c3aed' },
  { id: '7', name: 'MARXLOW',   color: '#06b6d4' },
];



// ─── REPAIR SERVICE CARD
const repairSteps = [
  { icon: 'call-outline',         labelKey: 'home.repair.step1' },
  { icon: 'bicycle-outline',      labelKey: 'home.repair.step2' },
  { icon: 'construct-outline',    labelKey: 'home.repair.step3' },
  { icon: 'home-outline',         labelKey: 'home.repair.step4' },
];

function RepairServiceCard({ isDark, BORDER }: any) {
  const [phone, setPhone] = useState('');
  const cardBg = isDark ? '#1a1206' : '#f5f0e8';
  const textDark = isDark ? '#ffffff' : '#111111';
  const subText = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const inputBg = isDark ? '#0d0d0d' : '#ffffff';

  return (
    <RNView style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 8, borderRadius: 16, backgroundColor: cardBg, borderWidth: 1, borderColor: isDark ? '#2a1f0a' : '#e8dcc8', padding: 18 }}>

      {/* Title */}
      <Text style={{ fontSize: 18, fontWeight: '800', color: textDark, marginBottom: 2 }}>
        {t('home.repair.title')}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: '800', color: AMBER, marginBottom: 16 }}>
        {t('home.repair.subtitle')}
      </Text>

      {/* Steps */}
      <RNView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        {repairSteps.map((step, index) => (
          <RNView key={step.labelKey} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <RNView style={{ alignItems: 'center', flex: 1 }}>
              <RNView style={{ width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: isDark ? '#3a2a0a' : '#d4c4a0', alignItems: 'center', justifyContent: 'center', marginBottom: 5, backgroundColor: isDark ? '#221a08' : '#ede3ce' }}>
                <Ionicons name={step.icon as any} size={18} color={AMBER} />
              </RNView>
              <Text style={{ fontSize: 9, color: subText, textAlign: 'center', fontWeight: '500' }}>{t(step.labelKey)}</Text>
            </RNView>
            {index < repairSteps.length - 1 && (
              <Text style={{ color: AMBER, fontSize: 12, marginBottom: 14, opacity: 0.6 }}>→</Text>
            )}
          </RNView>
        ))}
      </RNView>

      {/* Phone input */}
      <Text style={{ fontSize: 11, color: subText, marginBottom: 8 }}>
        {t('home.repair.leaveNumber')}
      </Text>
      <RNView style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: inputBg, borderRadius: 10, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: textDark, marginRight: 6 }}>TR +90</Text>
        <RNView style={{ width: 1, height: 16, backgroundColor: BORDER, marginRight: 10 }} />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="5__ __ __ __"
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          keyboardType="phone-pad"
          maxLength={10}
          style={{ flex: 1, fontSize: 14, color: textDark }}
        />
      </RNView>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        activeOpacity={0.85}
        style={{ backgroundColor: AMBER, borderRadius: 10, paddingVertical: 13, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
      >
        <Ionicons name="call-outline" size={16} color="#000" />
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#000' }}>{t('home.repair.callBack')}</Text>
      </TouchableOpacity>

    </RNView>
  );
}

//  MAIN COMPONENT 
export default function HomeScreen() {
  useLocale();
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const scheme  = useColorScheme();
  const isDark  = scheme === 'dark';

  const PAGE_BG    = isDark ? '#0d0d0d' : '#f2f2f7';
  const HEADER_BG  = isDark ? '#0d0d0d' : '#ffffff';
  const CARD_BG    = isDark ? '#131825' : '#ffffff';
  const TEXT       = isDark ? '#ffffff' : '#111111';
  const SUBTEXT    = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)';
  const BORDER     = isDark ? '#1e2433' : '#ebebeb';
  const SEARCH_BG  = isDark ? '#0B1525' : '#f0f0f5';
  const ICON_COLOR = isDark ? '#ffffff' : '#111111';
  const SEARCH_PH  = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const SEARCH_TC  = isDark ? '#ffffff' : '#111111';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchText,   setSearchText]   = useState('');
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentSlide + 1) % bannerSlides.length;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentSlide(next);
    }, 3500);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const onBannerScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
    setCurrentSlide(idx);
  };

  // ── Banner Slide ─────────────────────────────────────────────
  const renderBannerSlide = ({ item }: { item: typeof bannerSlides[0] }) => (
    <RNView style={{
      width: SCREEN_WIDTH - 32, height: 170, borderRadius: 12,
      backgroundColor: item.backgroundColor, flexDirection: 'row',
      alignItems: 'center', padding: 20, overflow: 'hidden',
    }}>
      <RNView style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>{item.topLabel}</Text>
        <Text style={{ fontSize: 30, fontWeight: '900', color: item.accentColor, letterSpacing: 1, marginTop: 2 }}>{item.title}</Text>
        <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 16 }}>{item.subtitle}</Text>
        <TouchableOpacity style={{ marginTop: 12, alignSelf: 'flex-start', backgroundColor: item.accentColor, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 }}>
          <Text style={{ color: '#000', fontSize: 11, fontWeight: '700' }}>{t('shopNow')}</Text>
        </TouchableOpacity>
      </RNView>
      <RNView style={{ width: 90, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="image-outline" size={40} color="rgba(255,255,255,0.1)" />
      </RNView>
    </RNView>
  );

  // ── Product Card ─────────────────────────────────────────────
  const renderProductCard = (item: typeof productSections[0]['products'][0], section: typeof productSections[0]) => (
    <TouchableOpacity
      key={item.id} activeOpacity={0.85}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/product-detail', params: { productId: item.id, categoryId: section.id } });
      }}
      style={{ width: 155, backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1, borderColor: BORDER, marginRight: 12, overflow: 'hidden' }}
    >
      <RNView style={{ height: 120, backgroundColor: isDark ? '#1a2030' : '#f5f5fa', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="image-outline" size={30} color={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
      </RNView>
      <RNView style={{ padding: 10 }}>
        <Text style={{ fontSize: 9, fontWeight: '700', marginBottom: 4, color: item.low ? AMBER : '#2ecc71' }}>● {item.stock}</Text>
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: '600', color: TEXT, lineHeight: 15, minHeight: 30, marginBottom: 8 }}>{item.name}</Text>
        <RNView style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: TEXT }}>{item.price}</Text>
          <Text style={{ fontSize: 10, fontWeight: '600', color: TEXT, marginBottom: 1 }}>.{item.dec}</Text>
          <Text style={{ fontSize: 10, color: SUBTEXT, marginBottom: 1, marginLeft: 2 }}>TL</Text>
        </RNView>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            addToCart({ id: item.id, name: item.name, price: item.price, dec: item.dec, categoryId: section.id, categoryTitle: section.title });
          }}
          style={{ backgroundColor: AMBER, borderRadius: 8, paddingVertical: 7, alignItems: 'center' }}
        >
          <Text style={{ color: '#000', fontSize: 10, fontWeight: '700' }}>{t('addToCart')}</Text>
        </TouchableOpacity>
      </RNView>
    </TouchableOpacity>
  );

  //  Product Section
  const renderSection = (section: typeof productSections[0]) => (
    <RNView key={section.id} style={{ marginBottom: 32 }}>
      <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 4 }}>
        <RNView style={{ flex: 1 }}>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <RNView style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: section.accentColor }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT }}>{section.title}</Text>
          </RNView>
          <Text style={{ fontSize: 11, color: SUBTEXT, marginTop: 3, marginLeft: 12 }}>{section.subtitle}</Text>
        </RNView>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: section.accentColor }}>{t('viewAll')}</Text>
          <Ionicons name="arrow-forward" size={13} color={section.accentColor} />
        </TouchableOpacity>
      </RNView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }}>
        {section.products.map(p => renderProductCard(p, section))}
      </ScrollView>
    </RNView>
  );

  // RENDER
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: HEADER_BG }} edges={['top']}>

      {/* HEADER */}
      <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: HEADER_BG, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, zIndex: 999 }}>
        <RNView>
          <Text style={{ fontSize: 22, fontWeight: '700', color: TEXT, letterSpacing: 0.3 }}>
            Alemdar <Text style={{ color: AMBER }}>Teknik</Text>
          </Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <Ionicons name="location-sharp" size={14} color={AMBER} />
            <Text style={{ fontSize: 10, color: SUBTEXT }}>{t('home.location')}</Text>
          </RNView>
        </RNView>

        {/* Right: Notifications + Cart */}
        <RNView style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity style={{ padding: 6 }}>
            <Ionicons name="notifications-outline" size={22} color={ICON_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/cart')} style={{ padding: 6 }}>
            <RNView>
              <Ionicons name="cart-outline" size={22} color={ICON_COLOR} />
              {totalItems > 0 && (
                <RNView style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#e3342f', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{totalItems}</Text>
                </RNView>
              )}
            </RNView>
          </TouchableOpacity>
        </RNView>
      </RNView>

      {/* SEARCH */}
      <RNView style={{ flexDirection: 'row', gap: 8, backgroundColor: HEADER_BG, paddingHorizontal: 16, paddingBottom: 14 }}>
        <RNView style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: SEARCH_BG, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
          <Ionicons name="search" size={16} color={SEARCH_PH} style={{ marginRight: 8 }} />
          <TextInput value={searchText} onChangeText={setSearchText} placeholder={t('home.searchPlaceholder')} placeholderTextColor={SEARCH_PH} style={{ flex: 1, fontSize: 13, color: SEARCH_TC }} />
        </RNView>
        <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 10, backgroundColor: SEARCH_BG, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="options-outline" size={20} color={ICON_COLOR} />
        </TouchableOpacity>
      </RNView>

      {/* BODY */}
      <ScrollView style={{ flex: 1, backgroundColor: PAGE_BG }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}>

        {/* BANNER */}
        <RNView style={{ marginHorizontal: 16, marginBottom: 4 }}>
          <FlatList
            ref={bannerRef} data={bannerSlides} horizontal pagingEnabled={false}
            snapToInterval={SCREEN_WIDTH - 32} decelerationRate="fast"
            showsHorizontalScrollIndicator={false} onScroll={onBannerScroll}
            scrollEventThrottle={16} keyExtractor={item => item.id}
            renderItem={renderBannerSlide}
            getItemLayout={(_, index) => ({ length: SCREEN_WIDTH - 32, offset: (SCREEN_WIDTH - 32) * index, index })}
          />
          <RNView style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 10, paddingBottom: 4 }}>
            {bannerSlides.map((_, i) => (
              <RNView key={i} style={{ height: 7, borderRadius: 4, width: i === currentSlide ? 20 : 7, backgroundColor: i === currentSlide ? AMBER : (isDark ? '#3a3a3a' : '#ccc') }} />
            ))}
          </RNView>
        </RNView>

        {/* CATEGORIES */}
        <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT }}>{t('home.categories')}</Text>
          <TouchableOpacity><Text style={{ fontSize: 12, fontWeight: '600', color: AMBER }}>{t('viewAll')}</Text></TouchableOpacity>
        </RNView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
          {categories.map(cat => (
            <TouchableOpacity key={cat.id} style={{ alignItems: 'center', width: 62 }}>
              <RNView style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                <Ionicons name={cat.icon as any} size={22} color={cat.color} />
              </RNView>
              <Text style={{ fontSize: 10, fontWeight: '600', color: TEXT, textAlign: 'center' }} numberOfLines={2}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BRANDS */}
        <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 28, marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: TEXT }}>{t('home.brands')}</Text>
          <TouchableOpacity><Text style={{ fontSize: 12, fontWeight: '600', color: AMBER }}>{t('viewAll')}</Text></TouchableOpacity>
        </RNView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {brands.map(brand => (
            <TouchableOpacity key={brand.id} style={{ paddingHorizontal: 16, height: 42, backgroundColor: CARD_BG, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <RNView style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: brand.color }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: TEXT, letterSpacing: 0.8 }}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DIVIDER */}
        <RNView style={{ height: 1, backgroundColor: BORDER, marginHorizontal: 16, marginTop: 28, marginBottom: 28 }} />

        {/* PRODUCT SECTIONS */}
        {renderSection(productSections[0])}

        {/* ⚡ REPAIR SERVICE — between Most Sold and Arduino */}
        <RepairServiceCard isDark={isDark} BORDER={BORDER} />

        {productSections.slice(1).map(renderSection)}

        {/* SOCIAL FOOTER */}
        <RNView style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: SUBTEXT, textAlign: 'center', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
            {t('home.followUs')}
          </Text>
          <RNView style={{ flexDirection: 'row', gap: 10 }}>
            {/* Facebook */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const { Linking } = require('react-native');
                Linking.openURL('https://www.facebook.com/AlemdarTeknikLtd');
              }}
              activeOpacity={0.8}
              style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12, backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER }}
            >
              <RNView style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#1877F2', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>f</Text>
              </RNView>
              <Text style={{ fontSize: 11, fontWeight: '600', color: TEXT }}>Facebook</Text>
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const { Linking } = require('react-native');
                Linking.openURL('https://www.instagram.com/alemdarteknik?igsh=MTV3enhzczUxMGFiYg%3D%3D&utm_source=qr');
              }}
              activeOpacity={0.8}
              style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12, backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER }}
            >
              <RNView style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="logo-instagram" size={18} color="#fff" />
              </RNView>
              <Text style={{ fontSize: 11, fontWeight: '600', color: TEXT }}>Instagram</Text>
            </TouchableOpacity>

            {/* Location */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const { Linking } = require('react-native');
                Linking.openURL('https://www.google.com/maps?q=Alemdar+Teknik,+Polis+Sk,+Lefko%C5%9Fa+5000&ftid=0x14de17339227c4f7:0x4bb7a378a71dcdc7&entry=gps&shh=CAE&lucs=,94297699,94275415,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjA1LjEuODYxMzIyMjEwMBgAIMi8BypILDk0Mjk3Njk5LDk0Mjc1NDE1LDk0MjMxMTg4LDk0MjgwNTY4LDQ3MDcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDk0Mjg2ODY5QgJDWQ%3D%3D&skid=6b7c7b7d-a985-4e3a-92a6-6e0ec7205e39&g_st=ic');
              }}
              activeOpacity={0.8}
              style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12, backgroundColor: CARD_BG, borderWidth: 1, borderColor: BORDER }}
            >
              <RNView style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#34A853', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="location" size={18} color="#fff" />
              </RNView>
              <Text style={{ fontSize: 11, fontWeight: '600', color: TEXT }}>Location</Text>
            </TouchableOpacity>
          </RNView>

          {/* Copyright */}
          <Text style={{ fontSize: 11, color: SUBTEXT, textAlign: 'center', marginTop: 16, marginBottom: 8 }}>
            {t('home.copyright')}
          </Text>
        </RNView>

      </ScrollView>
    </SafeAreaView>
  );
}
