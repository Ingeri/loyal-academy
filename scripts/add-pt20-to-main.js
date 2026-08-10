const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../app');

const walk = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const res = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(res) : [res];
  });
};

const files = walk(root).filter((file) => file.endsWith('.tsx') && !file.endsWith('layout.tsx') && !file.endsWith('not-found.tsx'));
let changed = [];

const mainClassPattern = /<main([^>]*className=)(['"])([^'"<>]*\bmin-h-screen\b[^'"<>]*)(\2)/g;

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const newText = text.replace(mainClassPattern, (match, before, quote, classes, closingQuote) => {
    if (classes.includes('pt-20')) {
      return match;
    }
    return `<main${before}${quote}${classes} pt-20${closingQuote}`;
  });

  if (newText !== text) {
    fs.writeFileSync(file, newText, 'utf8');
    changed.push(file);
  }
}

console.log('changed', changed.length);
changed.forEach((file) => console.log(file));
