import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('admin moderation entrypoint', () => {
  it('loads the moderation workspace from the browser entrypoint', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8');
    expect(source).toContain("import './moderation-console';");
  });
});
