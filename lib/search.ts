const BASE = "https://alemdarteknik.com";

export type SearchItem = {
  tableKey: string;
  section: string;
  id: number;
  title: string;
  image: string | null;
  href: string;
};

export async function liveSearch(query: string, limit = 8): Promise<SearchItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const res = await fetch(`${BASE}/live-search?query=${encodeURIComponent(trimmed)}&limit=${limit}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}