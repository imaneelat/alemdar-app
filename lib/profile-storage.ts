import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const PROFILE_STORAGE_KEY = "profile:delivery";

export const deliveryProfileSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  address: z.string(),
  flat: z.string(),
  city: z.string(),
});

export type DeliveryProfile = z.infer<typeof deliveryProfileSchema>;

export async function loadDeliveryProfile(): Promise<DeliveryProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = deliveryProfileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveDeliveryProfile(
  profile: DeliveryProfile,
): Promise<void> {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
