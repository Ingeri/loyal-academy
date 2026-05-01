import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL; // Your 6543 Pooler URL

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize the native PG driver
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // In Prisma 7, we pass the 'adapter' instead of 'datasource'
    adapter: adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;