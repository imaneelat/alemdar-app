export const KKTC_CITIES = [
  "Lefkoşa",
  "Gazimağusa",
  "Girne",
  "Güzelyurt",
  "İskele",
  "Lefke",
] as const;

export type KktcCity = (typeof KKTC_CITIES)[number];
