import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' }
)
  .split('\0')
  .filter(Boolean);

const forbiddenTrackedFiles = [
  /^google-services\.json$/,
  /^GoogleService-Info\.plist$/,
  /\.p8$/,
  /\.p12$/,
  /\.mobileprovision$/,
  /\.jks$/,
  /\.keystore$/,
  /service-account.*\.json$/i,
  /firebase.*credentials.*\.json$/i,
];

const forbiddenContent = [
  new RegExp('-----BEGIN (RSA |EC |DSA |OPENSSH |)PRIVATE ' + 'KEY-----'),
  new RegExp('"private_key"\\s*:\\s*"-----BEGIN PRIVATE ' + 'KEY-----'),
  /AIza[0-9A-Za-z_-]{35}/,
  /EXPO_TOKEN\s*=/,
  /SENTRY_AUTH_TOKEN\s*=/,
  /FIREBASE_CREDENTIALS\s*=/,
];

const failures = [];

for (const file of files) {
  if (forbiddenTrackedFiles.some(pattern => pattern.test(file))) {
    failures.push(`tracked forbidden file: ${file}`);
    continue;
  }

  if (/\.(png|jpg|jpeg|gif|webp|ico|ttf|lock|patch)$/i.test(file)) {
    continue;
  }

  const content = readFileSync(file, 'utf8');
  for (const pattern of forbiddenContent) {
    if (pattern.test(content)) {
      failures.push(`${file} matched ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error('Secret audit failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Secret audit passed.');
