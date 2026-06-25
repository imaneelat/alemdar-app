import { prisma } from '@/lib/prisma';
import { error, json } from '@/lib/http';

export async function GET(_request: Request, { id }: Record<string, string>) {
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return error('Invalid product id', 400);
  }

  try {
    const product = await prisma.main.findUnique({ where: { id: productId } });
    if (!product) {
      return error('Product not found', 404);
    }
    return json(product);
  } catch (e) {
    return error('Failed to load product', 500);
  }
}
