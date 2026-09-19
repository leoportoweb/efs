const { copyFileSync, existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const source = join('public', 'skills.json');
const backup = join('public', 'skills.json.bak');

if (existsSync(source)) {
  // Read current version to preserve it
  const currentContent = readFileSync(source, 'utf8');
  
  // Write backup
  writeFileSync(backup, currentContent);
  console.log('Backup created:', backup);
} else {
  console.error('Source file not found:', source);
  process.exit(1);
}