import { t, useLocale } from '@/lib/i18n';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AddressEditScreen() {
  useLocale();
  const [address, setAddress] = useState('');
  const [flat, setFlat] = useState('');
  const [phone, setPhone] = useState('');

  const cityWords = address.trim().split(/\s+/).slice(0, 2).join(', ');
  const inputStyle = { height: 48, borderWidth: 1, borderColor: '#26344C', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, fontWeight: '700' as const, color: '#FFFFFF', backgroundColor: '#0B1525', marginTop: 6, marginHorizontal: 24 };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Pressable onPress={Keyboard.dismiss}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={38} color="#FFFFFF" />
          </Pressable>

          <View style={styles.animationWrap}>
            <LottieView source={require('@/assets/animations/location.json')} autoPlay loop style={styles.animation} resizeMode="contain" />
          </View>

          {cityWords ? <Text style={styles.city}>{cityWords}</Text> : null}

          <Text style={styles.title}>{t('address.title')}</Text>

          <Text style={styles.label}>{t('address.line')}</Text>
          <TextInput value={address} onChangeText={setAddress} placeholderTextColor="#A9AEC0" style={inputStyle} />

          <Text style={styles.label}>{t('address.flat')}</Text>
          <TextInput value={flat} onChangeText={setFlat} placeholderTextColor="#A9AEC0" style={inputStyle} />

          <Text style={styles.label}>{t('address.phone')}</Text>
          <View style={styles.phoneWrap}>
            <View style={styles.phoneCode}>
              <Text style={{ fontSize: 18 }}>🇹🇷</Text>
              <Text style={styles.phoneCodeText}>+90</Text>
            </View>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor="#A9AEC0" style={{ flex: 1, paddingHorizontal: 12, fontSize: 14, fontWeight: '700' as const, color: '#FFFFFF' }} />
          </View>

          <Pressable style={styles.saveBtn} onPress={() => router.back()}>
            <Text style={styles.saveText}>{t('address.save')}</Text>
          </Pressable>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#02060E' },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 8, marginTop: 60, marginLeft: 24 },
  animationWrap: { alignItems: 'center', marginBottom: 8, paddingHorizontal: 24 },
  animation: { width: 200, height: 200 },
  city: { color: '#FF6B00', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 16, paddingHorizontal: 24 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 20, paddingHorizontal: 24 },
  label: { fontSize: 13, color: '#A9AEC0', marginBottom: 4, marginTop: 12, paddingHorizontal: 24 },
  phoneWrap: { height: 48, borderWidth: 1, borderColor: '#26344C', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1525', marginTop: 6, marginHorizontal: 24, overflow: 'hidden' },
  phoneCode: { width: 90, height: '100%', borderRightWidth: 1, borderRightColor: '#26344C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  phoneCodeText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  saveBtn: { marginTop: 24, height: 52, borderRadius: 12, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', marginHorizontal: 24 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});
