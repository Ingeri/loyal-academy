import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './database-url';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaMariaDb(getDatabaseUrl());

  return new PrismaClient({
    adapter,
  });
}

const cachedPrisma = globalForPrisma.prisma;

// Next.js preserves globals during hot reload. Discard a client generated before
// the Quote model was added, otherwise `prisma.quote` remains undefined.
export const prisma = cachedPrisma?.quote ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
