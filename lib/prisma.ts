import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    // In Prisma 7, we pass the 'adapter' instead of 'datasource'
    adapter: adapter,
  });
}

const cachedPrisma = globalForPrisma.prisma;

// Next.js preserves globals during hot reload. Discard a client generated before
// the Quote model was added, otherwise `prisma.quote` remains undefined.
export const prisma = cachedPrisma?.quote ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
