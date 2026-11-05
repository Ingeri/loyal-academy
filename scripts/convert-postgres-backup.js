const fs = require('node:fs');
const path = require('node:path');

const input = process.argv[2];
const output = process.argv[3] || 'db_backup/data_mysql.sql';

if (!input) {
  console.error('Usage: node scripts/convert-postgres-backup.js <postgres-data.sql> [output.sql]');
  process.exit(1);
}

function mysqlString(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function postgresArrayToJson(literal) {
  const source = literal.slice(1, -1);
  const values = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (character === '"' && source[index - 1] !== '\\') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += character;
    }
  }
  if (value) values.push(value.trim());

  return mysqlString(JSON.stringify(values.map((item) => item.replace(/^"|"$/g, '').replace(/\\"/g, '"'))));
}

const source = fs.readFileSync(input, 'utf8');
let converted = source.replace(/INSERT INTO\s+"public"\."([^"]+)"/g, 'INSERT INTO `$1`');
converted = converted.split('\n').map((line) => (
  line.startsWith('INSERT INTO') ? line.replace(/"([^"]+)"/g, '`$1`') : line
)).join('\n');
converted = converted.replace(/'(\{[^'\n]*\})'/g, (match, array) => postgresArrayToJson(array));

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, converted);
console.log(`Converted backup written to ${output}`);
