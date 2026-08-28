// Automatické nasazení přes SFTP.
//
//   npm run deploy        → build + nahrání dist/ na server
//   node deploy/deploy.mjs → jen nahrání (build musí proběhnout dřív)
//
// Přístupové údaje čte z deploy/.env (viz deploy/.env.example). Ten soubor
// NENÍ v gitu (.gitignore: .env.*).
//
// Bezpečnost:
//  - SFTP = šifrované (heslo i přenos přes SSH), na rozdíl od holého FTP.
//  - Nahrává se VŠE včetně config.php. Zdroj pravdy je lokální
//    public/config.php (gitignored, drží ostré klíče a hesla) – po buildu
//    se kopíruje do dist/ a odtud na server. Drž ho tedy vždy aktuální.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import SftpClient from 'ssh2-sftp-client';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const distDir = join(root, 'dist');

dotenv.config({ path: join(here, '.env'), quiet: true });

const {
  SFTP_HOST,
  SFTP_PORT = '24',
  SFTP_USER,
  SFTP_PASS,
  SFTP_REMOTE_DIR = '/www',
} = process.env;

if (!SFTP_HOST || !SFTP_USER || !SFTP_PASS) {
  console.error(
    '\n✖ Chybí přístupové údaje. Vytvoř deploy/.env podle deploy/.env.example:\n' +
      '   SFTP_HOST=...\n   SFTP_USER=...\n   SFTP_PASS=...\n   (volitelně SFTP_PORT, SFTP_REMOTE_DIR)\n',
  );
  process.exit(1);
}

// Ověř, že build existuje.
try {
  readFileSync(join(distDir, 'index.html'));
} catch {
  console.error('\n✖ dist/index.html nenalezen. Spusť nejdřív `npm run build`.\n');
  process.exit(1);
}

const sftp = new SftpClient();

console.log(`\n→ Nasazuji dist/ na ${SFTP_USER}@${SFTP_HOST}:${SFTP_PORT}${SFTP_REMOTE_DIR}\n`);

try {
  await sftp.connect({
    host: SFTP_HOST,
    port: Number(SFTP_PORT),
    username: SFTP_USER,
    password: SFTP_PASS,
  });

  // Nahraje celý strom dist/ 1:1 (včetně config.php).
  await sftp.uploadDir(distDir, SFTP_REMOTE_DIR);

  console.log('\n✓ Hotovo. Nahráno do', SFTP_REMOTE_DIR);
  console.log('  Zkontroluj: https://webkozar.cz/ a jednu podstránku (reload musí projít).');
} catch (err) {
  console.error('\n✖ Deploy selhal:', err.message);
  process.exitCode = 1;
} finally {
  await sftp.end();
}
