import fs from 'node:fs';

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error(
    'Usage: node scripts/prepare-postgres-data-for-mysql.mjs <postgres.sql> <mysql.sql>',
  );
  process.exit(1);
}

const source = fs.readFileSync(input, 'utf8');
const inserts = [];
const lines = source.split(/\r?\n/);
let pendingInsert = null;

const quoteIdentifiers = (sql) =>
  sql.replace(/"([A-Za-z_][A-Za-z0-9_]*)"/g, '`$1`');

const normalizePostgresArrayLiterals = (table, values) => {
  if (!['Course', 'Project'].includes(table)) return values;

  return values.replace(
    /'(\{(?:[^']|'')*\})'/g,
    (_match, array) => {
      const items = array
        .slice(1, -1)
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((item) => item.trim().replace(/^"|"$/g, ''))
        .map((item) => item.replace(/""/g, '"'));
      return `'${JSON.stringify(items).replace(/'/g, "''")}'`;
    },
  );
};

for (const line of lines) {
  if (!pendingInsert && line.startsWith('INSERT INTO "public".')) {
    pendingInsert = line;
  } else if (pendingInsert) {
    pendingInsert += `\n${line}`;
  } else {
    continue;
  }

  if (!pendingInsert.trimEnd().endsWith(';')) continue;

  const normalized = pendingInsert.trim().replace(/;$/, '').replace(
    /INSERT INTO "public"\."([A-Za-z_][A-Za-z0-9_]*)"/,
    'INSERT INTO `$1`',
  );
  const valuesIndex = normalized.search(/\)\s+VALUES\s+/i);

  if (valuesIndex === -1) {
    inserts.push(quoteIdentifiers(normalized) + ';');
    pendingInsert = null;
    continue;
  }

  const head = normalized.slice(0, valuesIndex + 1);
  const table = normalized.match(/^INSERT INTO `([^`]+)`/)?.[1];
  const values = normalizePostgresArrayLiterals(
    table,
    normalized.slice(valuesIndex + 1),
  );
  inserts.push(quoteIdentifiers(head) + values + ';');
  pendingInsert = null;
}

const mysqlSql = [
  "SET sql_mode='NO_BACKSLASH_ESCAPES';",
  'SET FOREIGN_KEY_CHECKS=0;',
  ...inserts,
  'SET FOREIGN_KEY_CHECKS=1;',
  '',
].join('\n');

fs.writeFileSync(output, mysqlSql);
console.log(`Converted ${inserts.length} INSERT statements to ${output}`);
