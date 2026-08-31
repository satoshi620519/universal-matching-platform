import { access, readdir } from 'node:fs/promises';
import { dirname, fileURLToPath, join } from 'node:path';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(packageRoot, 'migrations');
const destination = join(packageRoot, 'dist', 'migrations');

const sourceFiles = (await readdir(source))
  .filter((name) => name.endsWith('.sql'))
  .sort();
const destinationFiles = (await readdir(destination))
  .filter((name) => name.endsWith('.sql'))
  .sort();

if (JSON.stringify(sourceFiles) !== JSON.stringify(destinationFiles)) {
  throw new Error(
    `Migration build output mismatch: source=${JSON.stringify(sourceFiles)} dist=${JSON.stringify(destinationFiles)}`,
  );
}

await Promise.all(
  destinationFiles.map((name) => access(join(destination, name))),
);
