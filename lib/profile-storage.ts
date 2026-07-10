import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = 'profile:delivery';

export type DeliveryProfile = {
  name: string;
  phone: string;
  address: string;
  flat: string;
  city: string;
  postalCode: string;
};

function isDeliveryProfile(value: unknown): value is DeliveryProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as DeliveryProfile;
  return (
    typeof profile.name === 'string' &&
    typeof profile.phone === 'string' &&
    typeof profile.address === 'string' &&
    typeof profile.flat === 'string' &&
    typeof profile.city === 'string' &&
    typeof profile.postalCode === 'string'
  );
}

export async function loadDeliveryProfile(): Promise<DeliveryProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isDeliveryProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveDeliveryProfile(profile: DeliveryProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
