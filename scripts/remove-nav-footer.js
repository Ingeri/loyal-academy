const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../app');
const walk = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const res = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(res) : [res];
  });
};

const isPageFile = (file) => file.endsWith('.tsx') && !file.endsWith('layout.tsx');
const files = walk(root).filter(isPageFile);
let changed = [];

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  const lines = text.split(/\r?\n/);
  const out = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (/^import\s+\{?\s*Navigation\s*\}?\s+from\s+['"][^'"]*\/navigation['"]/.test(trimmed)) continue;
    if (/^import\s+Footer\s+from\s+['"][^'"]*\/footer['"]/.test(trimmed)) continue;
    if (/^<Navigation\s*\/?>$/.test(trimmed)) continue;
    if (/^<Footer\s*\/?>$/.test(trimmed)) continue;
    out.push(line);
  }

  const result = out.join('\n');
  if (result !== original) {
    fs.writeFileSync(file, result, 'utf8');
    changed.push(file);
  }
}

console.log('changed', changed.length);
changed.forEach((file) => console.log(file));
