import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const nested = join(dist, 'src');
if (existsSync(nested)) {
  for (const entry of readdirSync(nested)) renameSync(join(nested, entry), join(dist, entry));
  rmSync(nested, { recursive: true, force: true });
}
