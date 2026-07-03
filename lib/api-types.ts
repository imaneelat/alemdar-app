/**
 * Response types returned by the /api endpoints.
 *
 * Note: Prisma `Decimal` and `Date` values are serialized to JSON strings,
 * so numeric DB columns appear here as `string`.
 */

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
};

/** Row from the `main` master catalog. */
export type MainProduct = {
  id: number;
  english_name: string | null;
  turkish_name: string | null;
  barcode: string | null;
  kodu: string | null;
  price: string | null;
  whole_price: string | null;
  image_filename: string | null;
  category: string | null;
  sub_category: string | null;
  subsub_category: string | null;
  quantity: string | null;
  kalan_miktar: string | null;
  description: string | null;
};

/** Normalized product shape returned by section / search / similars endpoints. */
export type NormalizedProduct = {
  id: number;
  section: string;
  name: string | null;
  price: string | null;
  image_filename: string | null;
  category: string | null;
};

export type UniversalSearchItem = {
  tableKey: string;
  section: string;
  id: number;
  title: string;
  image: string | null;
  href: string;
};

export type SectionCount = {
  section: string;
  table: string;
  count: number;
};

export type CategoryCount = { category: string | null; count: number };
export type SubCategoryCount = { sub_category: string | null; count: number };

export type Invoice = {
  id: number;
  invoice_number: string;
  date_created: string | null;
  total_amount: string;
  status: string | null;
  created_at: string | null;
  printed: boolean;
  undone_at: string | null;
  _count?: { invoice_items: number };
};

export type InvoiceItem = {
  id: number;
  invoice_id: number | null;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string | null;
  barcode: string | null;
  source_table_key: string | null;
};

export type InvoiceWithItems = Invoice & { invoice_items: InvoiceItem[] };

export type HealthResponse = { status: string; db: string; time: string };
