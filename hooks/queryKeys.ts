/** Centralized TanStack Query keys so caches stay consistent across hooks. */
export const queryKeys = {
  health: () => ["health"] as const,
  sections: () => ["sections"] as const,
  sectionProducts: (section: string, limit: number) =>
    ["sections", section, { limit }] as const,
  products: (filters: Record<string, unknown>) =>
    ["products", filters] as const,
  product: (id: number) => ["products", id] as const,
  searchProducts: (q: string, section: string | undefined, limit: number) =>
    ["products", "search", { q, section, limit }] as const,
  categories: () => ["categories"] as const,
  sectionCategories: (section: string) => ["categories", { section }] as const,
  similars: (section: string, id: number) => ["similars", section, id] as const,
  invoices: (filters: Record<string, unknown>) =>
    ["invoices", filters] as const,
  invoice: (id: number) => ["invoices", id] as const,
};
