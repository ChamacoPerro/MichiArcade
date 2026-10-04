import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const wwwDir = path.join(rootDir, 'www');

if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const items = ['index.html', 'manifest.json', 'sw.js', 'assets', 'js', 'styles'];

for (const item of items) {
  const src = path.join(rootDir, item);
  const dest = path.join(wwwDir, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
  }
}

console.log('✓ Successfully prepared www/ folder for standalone offline APK packaging.');
