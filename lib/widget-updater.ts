import StockQuickWidget from '@/widgets/StockQuickWidget'

const API = 'https://alemdarteknik.com/live-search'

type StockProduct = {
  id: number
  title: string
  category: string
  price: number | null
}

type SearchItem = {
  tableKey: string
  section: string
  id: number
  title: string
  price?: number | null
}

async function fetchTrendingProducts(): Promise<StockProduct[]> {
  try {
    const res = await fetch(API + '?query=&limit=20')
    if (!res.ok) return []
    const items: SearchItem[] = await res.json()
    return items.slice(0, 16).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.tableKey,
      price: item.price ?? null,
    }))
  } catch {
    return []
  }
}

export async function updateStockWidget(): Promise<void> {
  const products = await fetchTrendingProducts()
  StockQuickWidget.updateSnapshot({
    products,
    lastUpdated: Date.now(),
  })
}
