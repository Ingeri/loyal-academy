import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

/**
 * Load .env.local explicitly. 
 * This ensures Prisma finds your DATABASE_URL even in 
 * Next.js environments that default to .env.local.
 */
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // This pulls the URL from your .env.local file
    url: process.env.DIRECT_URL,
  },
});