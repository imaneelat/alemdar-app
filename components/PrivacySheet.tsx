import BottomSheet, { ANIMATIONS, CUSTOM_BACKDROP_POSITIONS, type BottomSheetMethods } from '@devvie/bottom-sheet';
import { useRef, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { t, useLocale } from '@/lib/i18n';

type Props = { visible: boolean; onClose: () => void };

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  text: { color: '#A9AEC0', fontSize: 13, lineHeight: 20 },
});

export default function PrivacySheet({ visible, onClose }: Props) {
  useLocale();
  const ref = useRef<BottomSheetMethods>(null);
  useEffect(() => {
    if (visible) ref.current?.open();
    else ref.current?.close();
  }, [visible]);
  return (
    <BottomSheet
      ref={ref}
      height="75%"
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('privacyTitle')}</Text>
          <Text style={styles.text}>{t('privacyText')}</Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
