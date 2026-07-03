# Live Search API

Base URL: `https://alemdarteknik.com`

## Endpoint

```
GET /live-search?query=<search_term>&limit=<max_results>
```

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | Yes | — | Search term (product name, category, keyword) |
| `limit` | integer | No | `8` | Max results to return (1–20) |

## Response

Returns a JSON array of `UniversalSearchItem`. Empty array when query is blank.

```ts
type UniversalSearchItem = {
  tableKey: string;   // product table key: "arduino", "mainled", "sound", etc.
  section: string;    // display label: "Arduino", "Cable", "Sound", etc.
  id: number;         // product ID in its source table
  title: string;      // product name
  image: string|null; // full image URL or null if no image
  href: string;       // relative URL to product page on the website
}
```

## Examples

### Search for "servo"

```bash
curl "https://alemdarteknik.com/live-search?query=servo&limit=2"
```

Response:
```json
[
  {
    "tableKey": "arduino",
    "section": "Arduino",
    "id": 286,
    "title": "SERVO MOTOR TESTER",
    "image": "https://pub-fc24514cefb14a198a4c94ce569ea845.r2.dev/arduinoproducts/3347e5e2-346e-4531-9b83-817dacf626dd-N286-mJfYDbnJ9nY4YjT6MCpGUi9qA7XJhC.png",
    "href": "/products/arduino?query=SERVO%20MOTOR%20TESTER"
  },
  {
    "tableKey": "arduino",
    "section": "Arduino",
    "id": 48,
    "title": "12 V 20A Digital Adjuatable Mini Thermostat",
    "image": "https://pub-fc24514cefb14a198a4c94ce569ea845.r2.dev/arduinoproducts/48-N48-ctAHva20hon1uZIeSl9aG0nXrGXZLd.png",
    "href": "/products/arduino?query=12%20V%2020A%20Digital%20Adjuatable%20Mini%20Thermostat"
  }
]
```

### Empty query returns empty array

```bash
curl "https://alemdarteknik.com/live-search?query="
# → []
```

## React Native / Expo Integration

Simple fetch wrapper:

```ts
// lib/search.ts
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
```

Usage with a debounced TextInput:

```tsx
import { useState, useEffect } from "react";
import { TextInput, FlatList, Text, Image, Pressable } from "react-native";
import { liveSearch, type SearchItem } from "@/lib/search";

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      liveSearch(query).then(setResults).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />
      <FlatList
        data={results}
        keyExtractor={(item) => `${item.tableKey}-${item.id}`}
        renderItem={({ item }) => (
          <Pressable>
            {item.image && <Image source={{ uri: item.image }} style={{ width: 48, height: 48 }} />}
            <Text>{item.title}</Text>
            <Text>{item.section}</Text>
          </Pressable>
        )}
      />
    </>
  );
}
```

## How It Works (Server Side)

The search queries `public.semantic_embeddings` — a pgvector table populated by `scripts/sync-semantic-embeddings.ts`. It uses:

1. **Prefix match** on `autocomplete_products` materialized view (fast, for short queries)
2. **pg_trgm similarity** on `name` and `search_text` columns (fuzzy, for longer queries)

Results are merged, deduplicated, and ranked by relevance score.

## Updating Search Data

When new products are added to the database, run the sync script to generate embeddings:

```bash
cd alemdar-website
node scripts/sync-semantic-embeddings.mjs
```

Requires `DATABASE_URL` and `OPENROUTER_API_KEY` in `.env`.

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success (empty array when no query or no matches) |
| 500  | Server error (returns `[]`) |
