import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { getDatabaseUrl } from '../lib/database-url';

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(getDatabaseUrl()) });

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Starting Lesson Enrichment Process...");

  // Path to your full lessons.json (relative to this file)
  const dataPath = path.join(__dirname, 'lessons.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error("❌ Error: lessons.json not found in the prisma folder!");
    return;
  }

  // Load and parse the 336 lesson records
  const lessonsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📦 Found ${lessonsData.length} lessons to update.`);

  for (const lesson of lessonsData) {
    try {
      // update targets the UUID and overwrites the JSONB content field
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          content: lesson.content, 
        },
      });
      console.log(`✅ Updated Lesson ID: ${lesson.id}`);
    } catch (error) {
      console.error(`[ERROR] Failed to update lesson ${lesson.id}:`, error);
    }
  }

  console.log("\n✨ DATABASE UPDATE COMPLETE ✨");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });