import BottomSheet, { ANIMATIONS, CUSTOM_BACKDROP_POSITIONS, type BottomSheetMethods } from '@devvie/bottom-sheet';
import { useRef, useEffect, useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { setLocale } from '@/lib/i18n';

type Props = { visible: boolean; onClose: () => void };

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 20 },
  btn: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16, marginBottom: 10},
  flag: { fontSize: 26, marginRight: 14 },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', flex: 1 },
  check: { color: '#FF6B00', fontSize: 18, fontWeight: '700' },
});

export default function LanguageSheet({ visible, onClose }: Props) {
  const ref = useRef<BottomSheetMethods>(null);
  const [lang, setLang] = useState('en');
  useEffect(() => {
    if (visible) ref.current?.open();
    else ref.current?.close();
  }, [visible]);
  const select = (code: string) => { setLang(code); setLocale(code); onClose(); };
  return (
    <BottomSheet
      ref={ref}
      height="30%"
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
      <View style={styles.content}>
        <Pressable style={styles.btn} onPress={() => select('en')}>
          <Text style={styles.flag}>🇬🇧</Text>
          <Text style={styles.label}>English</Text>
          {lang === 'en' ? <Text style={styles.check}>✓</Text> : null}
        </Pressable>
        <Pressable style={styles.btn} onPress={() => select('tr')}>
          <Text style={styles.flag}>🇹🇷</Text>
          <Text style={styles.label}>Türkçe</Text>
          {lang === 'tr' ? <Text style={styles.check}>✓</Text> : null}
        </Pressable>
      </View>
    </BottomSheet>
  );
}
