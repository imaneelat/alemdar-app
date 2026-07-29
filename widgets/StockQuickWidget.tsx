import { Text, VStack, HStack } from '@expo/ui/swift-ui'
import {
  font,
  foregroundStyle,
  background,
  clipShape,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers'
import { createWidget, type WidgetEnvironment } from 'expo-widgets'

type StockProduct = {
  id: number
  title: string
  category: string
  price: number | null
}

type StockWidgetProps = {
  products: StockProduct[]
  lastUpdated: number
}

const CATEGORY_COLORS: Record<string, string> = {
  arduino: '#00979D',
  mainled: '#FF6B00',
  sound: '#8B5CF6',
  solardb: '#F59E0B',
  batteries: '#10B981',
  adapters: '#3B82F6',
  chargers: '#EF4444',
  electric: '#6366F1',
  fans: '#06B6D4',
  filaments: '#EC4899',
  tv_remotes: '#14B8A6',
  lamps: '#F97316',
  scrawesdriver: '#6B7280',
  spray_gum: '#84CC16',
  others: '#78716C',
  mexxsun: '#EAB308',
}

const getInitials = (title: string): string => {
  const parts = title.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return title.slice(0, 2).toUpperCase()
}

const formatPrice = (p: number | null): string => {
  if (p == null) return ''
  return '$' + p
}

const ProductCircle = (p: StockProduct) => {
  'widget'
  const color: string = CATEGORY_COLORS[p.category] ?? '#6B7280'
  const initials: string = getInitials(p.title)
  const priceText: string = formatPrice(p.price)

  return (
    <VStack modifiers={[padding({ horizontal: 4 })]}>
      <VStack
        modifiers={[
          frame({ width: 48, height: 48 }),
          background(color),
          clipShape('circle'),
        ]}
      >
        <Text
          modifiers={[
            font({ size: 14, weight: 'bold' }),
            foregroundStyle('#FFFFFF'),
          ]}
        >
          {initials}
        </Text>
      </VStack>
      <Text
        modifiers={[
          font({ size: 9, weight: 'medium' }),
          foregroundStyle({ type: 'hierarchical', style: 'primary' }),
          padding({ top: 2 }),
        ]}
      >
        {initials}
      </Text>
      {priceText !== '' ? (
        <Text
          modifiers={[
            font({ size: 8 }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
          ]}
        >
          {priceText}
        </Text>
      ) : null}
    </VStack>
  )
}

const StockQuickWidget = (props: StockWidgetProps, environment: WidgetEnvironment) => {
  'widget'
  const { products } = props
  const fam = environment.widgetFamily
  const columns: number =
    fam === 'systemSmall' ? 2 : fam === 'systemMedium' ? 4 : fam === 'systemExtraLarge' ? 6 : 4
  const maxRows: number =
    fam === 'systemSmall' ? 2 : fam === 'systemMedium' ? 1 : fam === 'systemExtraLarge' ? 4 : 3
  const showHeader = fam !== 'systemSmall'
  const orange = '#FF6B00'

  const grid: StockProduct[][] = []
  for (let i = 0; i < products.length; i += columns) {
    grid.push(products.slice(i, i + columns))
  }
  const visible = grid.slice(0, maxRows)

  return (
    <VStack modifiers={[padding({ all: fam === 'systemSmall' ? 8 : 12 })]}>
      {showHeader ? (
        <HStack modifiers={[padding({ bottom: 6 })]}>
          <Text
            modifiers={[font({ size: 11, weight: 'bold' }), foregroundStyle(orange)]}
          >
            Alemdar Stock
          </Text>
        </HStack>
      ) : null}
      {visible.map((row, ri) => (
        <HStack key={`row-${ri}`} modifiers={[padding({ vertical: 2 })]}>
          {row.map((p) => (
            <ProductCircle key={p.id} {...p} />
          ))}
        </HStack>
      ))}
    </VStack>
  )
}

export default createWidget('StockQuickWidget', StockQuickWidget)
