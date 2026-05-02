import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    // Escaped quotes are essential for Windows terminal compatibility
    seed: 'ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts',
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});