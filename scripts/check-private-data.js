const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bannedText = [
  'real plate here',
  'private phone here',
];

const bannedPatterns = [
  /\b[A-Z]\d{5}\b/,
  /\+[0-9]{10,15}\b/,
  /@[a-z0-9.-]+\.[a-z]{2,}/i,
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

let failed = false;

for (const filePath of walk(root)) {
  if (path.basename(filePath) === 'check-private-data.js') continue;

  const content = fs.readFileSync(filePath);
  const text = content.toString('utf8');
  for (const word of bannedText) {
    if (text.includes(word)) {
      console.error(`Private value found in ${path.relative(root, filePath)}: ${word}`);
      failed = true;
    }
  }
  for (const pattern of bannedPatterns) {
    if (pattern.test(text)) {
      console.error(`Possible private value found in ${path.relative(root, filePath)}: ${pattern}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('No private values found.');
