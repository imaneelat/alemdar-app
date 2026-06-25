import { prisma } from '@/lib/prisma';
import { error, json } from '@/lib/http';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch (e) {
    return error('Database unreachable', 503);
  }
}
