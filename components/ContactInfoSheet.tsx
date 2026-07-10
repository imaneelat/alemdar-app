import BottomSheet, { ANIMATIONS, CUSTOM_BACKDROP_POSITIONS, type BottomSheetMethods } from '@devvie/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useRef, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { t, useLocale } from '@/lib/i18n';

type Props = { visible: boolean; onClose: () => void };

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  closeBtn: { position: 'absolute', top: 10, right: 16, zIndex: 1, padding: 6 },
  animationWrap: { alignItems: 'center', marginBottom: 4 },
  animation: { width: 120, height: 120 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  subtitle: { color: '#A9AEC0', fontSize: 13, lineHeight: 19, marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 13, color: '#A9AEC0', marginBottom: 6, marginTop: 14 },
  input: { height: 48, borderWidth: 1, borderColor: '#26344C', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, fontWeight: '700', color: '#FFFFFF', backgroundColor: '#0B1525' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  phoneWrap: { height: 48, borderWidth: 1, borderColor: '#26344C', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1525', overflow: 'hidden' },
  phoneCode: { width: 80, height: '100%', borderRightWidth: 1, borderRightColor: '#26344C', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  phoneCodeText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  note: { color: '#A9AEC0', fontSize: 11, textAlign: 'center', marginTop: 14 },
  saveBtn: { marginTop: 20, height: 52, borderRadius: 12, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});

export default function ContactInfoSheet({ visible, onClose }: Props) {
  useLocale();
  const ref = useRef<BottomSheetMethods>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [flat, setFlat] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (visible) ref.current?.open();
    else ref.current?.close();
  }, [visible]);

  return (
    <BottomSheet
      ref={ref}
      height="90%"
      animationType={ANIMATIONS.SLIDE}
      backdropMaskColor="#00000080"
      closeOnBackdropPress
      closeOnDragDown
      hideDragHandle={false}
      dragHandleStyle={{ width: 40, height: 5, borderRadius: 3, backgroundColor: '#26344C', alignSelf: 'center', marginTop: 10 }}
      disableDragHandlePanning={false}
      disableBodyPanning={false}
      android_backdropMaskRippleColor="#26344C"
      customBackdropPosition={CUSTOM_BACKDROP_POSITIONS.BEHIND}
      modal
      openDuration={500}
      closeDuration={350}
      android_closeOnBackPress
      disableKeyboardHandling={false}
      onOpen={() => {}}
      onClose={onClose}
      onAnimate={(_v: number) => {}}
      style={{ backgroundColor: '#101928' }}
    >
      <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
        <Feather name="x" size={22} color="#A9AEC0" />
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.animationWrap}>
            <LottieView
              source={require('@/assets/animations/location.json')}
              autoPlay
              loop
              style={styles.animation}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{t('contactInfo.title')}</Text>
          <Text style={styles.subtitle}>{t('contactInfo.subtitle')}</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('contactInfo.firstNameLabel')}</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t('contactInfo.firstNamePlaceholder')}
                placeholderTextColor="#A9AEC0"
                style={styles.input}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>{t('contactInfo.lastNameLabel')}</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder={t('contactInfo.lastNamePlaceholder')}
                placeholderTextColor="#A9AEC0"
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.label}>{t('contactInfo.emailLabel')}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('contactInfo.emailPlaceholder')}
            placeholderTextColor="#A9AEC0"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>{t('contactInfo.phoneLabel')}</Text>
          <View style={styles.phoneWrap}>
            <View style={styles.phoneCode}>
              <Text style={{ fontSize: 16 }}>🇹🇷</Text>
              <Text style={styles.phoneCodeText}>+90</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="5__ ___ ____"
              placeholderTextColor="#A9AEC0"
              style={{ flex: 1, paddingHorizontal: 12, fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}
            />
          </View>

          <Text style={styles.label}>{t('contactInfo.streetLabel')}</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder={t('contactInfo.streetPlaceholder')}
            placeholderTextColor="#A9AEC0"
            style={styles.input}
          />

          <Text style={styles.label}>{t('contactInfo.flatLabel')}</Text>
          <TextInput
            value={flat}
            onChangeText={setFlat}
            placeholder={t('contactInfo.flatPlaceholder')}
            placeholderTextColor="#A9AEC0"
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>{t('contactInfo.cityLabel')}</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder={t('contactInfo.cityPlaceholder')}
                placeholderTextColor="#A9AEC0"
                style={styles.input}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>{t('contactInfo.postalCodeLabel')}</Text>
              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder={t('contactInfo.postalCodePlaceholder')}
                placeholderTextColor="#A9AEC0"
                keyboardType="number-pad"
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={onClose}>
            <Text style={styles.saveText}>{t('contactInfo.save')}</Text>
          </Pressable>

          <Text style={styles.note}>{t('contactInfo.optionalNote')}</Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
