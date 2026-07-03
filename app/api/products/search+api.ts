import { prisma } from '@/lib/prisma';
import { error, json, parseIntParam } from '@/lib/http';
import { getSection, normalizeRow } from '@/lib/sections';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const section = url.searchParams.get('section');
  const limit = parseIntParam(url.searchParams.get('limit'), 20, { max: 100 });

  if (q.length < 1) {
    return error('Query "q" must be at least 1 character', 400);
  }

  try {
    // Optionally search within a specific allowlisted section table.
    if (section) {
      const cfg = getSection(section);
      if (!cfg) return error(`Unknown section "${section}"`, 404);
      const delegate = (prisma as any)[cfg.table];
      const or = cfg.nameFields.map((f) => ({ [f]: { contains: q, mode: 'insensitive' } }));
      const rows = await delegate.findMany({ where: { OR: or }, take: limit, orderBy: { id: 'asc' } });
      return json({ q, section, data: rows.map((r: Record<string, any>) => normalizeRow(section, r)) });
    }

    // Default: search the master catalog (main).
    const data = await prisma.main.findMany({
      where: {
        OR: [
          { english_name: { contains: q, mode: 'insensitive' } },
          { turkish_name: { contains: q, mode: 'insensitive' } },
          { barcode: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { id: 'asc' },
    });
    return json({ q, data });
  } catch (e) {
    return error('Search failed', 500);
  }
}
