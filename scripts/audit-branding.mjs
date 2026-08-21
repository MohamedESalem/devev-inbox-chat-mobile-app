import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const collectFiles = path => {
  const fullPath = join(root, path);
  if (!existsSync(fullPath)) return [];
  const stat = statSync(fullPath);
  if (stat.isFile()) return [fullPath];

  return readdirSync(fullPath).flatMap(entry => {
    const child = join(path, entry);
    if (/[\\/]specs?[\\/]|[\\/]stories?[\\/]/.test(`${child}/`)) return [];
    const childFullPath = join(root, child);
    const childStat = statSync(childFullPath);
    if (childStat.isDirectory()) return collectFiles(child);
    if (/\.(ts|tsx|js|json|md|yml|yaml|example)$/.test(entry)) return [childFullPath];
    return [];
  });
};

const relative = file => file.replace(`${root}\\`, '').replace(`${root}/`, '');

const checks = [
  {
    files: [
      'app.config.ts',
      '.env.example',
      'README.md',
      'src/screens/auth',
      'src/screens/settings',
      'src/navigation',
      'src/constants',
      'src/store/settings',
      'src/utils/ssoUtils.ts',
      'src/utils/pushUtils.ts',
    ],
    patterns: [
      /app\.chatwoot\.com/i,
      /chatwootapp/i,
      /com\.chatwoot\.app/i,
      /Chatwoot Mobile/,
      /ChatwootIcon/,
      /EXPO_PUBLIC_CHATWOOT_(BASE_URL|WEBSITE_TOKEN)/,
    ],
  },
  {
    files: ['src/i18n'],
    patterns: [/Chatwoot/i, /app\.chatwoot\.com/i, /chatwootapp/i],
  },
];

const failures = [];

for (const check of checks) {
  const files = check.files.flatMap(collectFiles);
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    for (const pattern of check.patterns) {
      if (pattern.test(content)) {
        failures.push(`${relative(file)} matched ${pattern}`);
      }
    }
  }
}

if (failures.length) {
  console.error('User-visible Chatwoot branding audit failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('User-visible branding audit passed.');
