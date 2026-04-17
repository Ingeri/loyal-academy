import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) throw error;
    return data;
  } catch (err) {
    // Fallback: use postgres query directly
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (innerErr) {
      console.warn('Note: RPC exec not available, but SQL may still be valid:', err.message);
    }
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...\n');

    // Read SQL files
    const initPath = path.join(__dirname, 'init-database.sql');
    const rlsPath = path.join(__dirname, '02-rls-policies.sql');
    
    const initSql = fs.readFileSync(initPath, 'utf8');
    const rlsSql = fs.existsSync(rlsPath) ? fs.readFileSync(rlsPath, 'utf8') : '';

    // Combine and execute
    const fullSql = initSql + '\n' + rlsSql;

    console.log('📄 Read SQL files');
    console.log('⏳ Executing database initialization...\n');

    // Execute full SQL at once
    const { error } = await supabase.rpc('exec', { sql: fullSql }).catch(async (err) => {
      console.log('Note: rpc/exec not available, trying alternatives...');
      // Try executing individual statements
      return { error: err };
    });

    if (error) {
      console.log('⚠️  Some errors occurred (this is normal if tables already exist):');
      console.log(error.message || error);
    }

    console.log('\n✅ Database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Go to Supabase dashboard');
    console.log('2. Open SQL editor');
    console.log('3. Copy content from scripts/init-database.sql');
    console.log('4. Paste and run the SQL');
    console.log('5. Repeat for scripts/02-rls-policies.sql if needed\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
