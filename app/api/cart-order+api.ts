const CART_ORDER_URL = 'https://www.alemdarteknik.com/api/cart-order';

const NO_STORE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const FORWARD_FIELDS = [
  'phone',
  'deliveryMethod',
  'delivery',
  'name',
  'address',
  'city',
  'postalCode',
  'total',
  'discountedTotal',
  'cartItemsFormatted',
] as const;

function noStoreJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function noStoreError(message: string, status = 400): Response {
  return noStoreJson({ error: message }, status);
}

/** Proxy cart orders to the live website backend (same pattern as live search). */
export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const forward = new FormData();

    for (const field of FORWARD_FIELDS) {
      const value = incoming.get(field);
      if (value != null && String(value).trim() !== '') {
        forward.append(field, String(value));
      }
    }

    if (!forward.has('deliveryMethod')) forward.append('deliveryMethod', 'ship');
    if (!forward.has('delivery')) forward.append('delivery', 'ship');

    const response = await fetch(CART_ORDER_URL, {
      method: 'POST',
      body: forward,
      cache: 'no-store',
    });

    let body: { ok?: boolean; error?: string } | null = null;
    try {
      body = (await response.json()) as { ok?: boolean; error?: string };
    } catch {
      return noStoreError('Invalid order response', 502);
    }

    if (!response.ok) {
      return noStoreError(body?.error ?? 'Order failed', response.status);
    }

    if (body?.ok) {
      return noStoreJson({ ok: true });
    }

    return noStoreError(body?.error ?? 'Order failed', 400);
  } catch {
    return noStoreError('Order failed', 500);
  }
}
