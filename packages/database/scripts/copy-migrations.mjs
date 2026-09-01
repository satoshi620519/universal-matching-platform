import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
);
const source = join(packageRoot, 'migrations');
const destination = join(packageRoot, 'dist', 'migrations');

await mkdir(destination, { recursive: true });

for (const entry of await readdir(source, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.sql')) {
    await cp(join(source, entry.name), join(destination, entry.name));
  }
}
