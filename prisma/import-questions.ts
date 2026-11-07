import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { getDatabaseUrl } from '../lib/database-url';

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(getDatabaseUrl()) });

async function main() {
  const filePath = './prisma/questions_and_options.json';
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`🚀 Starting import of ${data.length} questions...`);

  for (const item of data) {
    try {
      await prisma.question.create({
        data: {
          quizId: item.assessmentId,
          text: item.text,
          options: {
            create: item.options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.isCorrect
            }))
          }
        }
      });
    } catch (err: any) {
      if (err.code === 'P2003') {
        console.error(`⚠️ FK Error: Quiz ID ${item.assessmentId} not found.`);
      } else {
        console.error(`❌ Error: ${err.message}`);
      }
    }
  }
  console.log("✅ Import process complete.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());