import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'apps/web/public');
const read = (name: string) => readFileSync(resolve(root, name), 'utf8');

describe('demo authentication integration', () => {
  it('exposes an authentication entry point in the actual matching UI', () => {
    const html = read('demo-v5.html');
    expect(html).toContain('auth:open');
    expect(html).toContain('ログイン');
    expect(html).toContain('未ログイン');
  });

  it('renders authenticated and logout states in the matching UI', () => {
    const html = read('demo-v5.html');
    expect(html).toContain('ログイン中');
    expect(html).toContain('auth:logout');
  });

  it('keeps auth requests connected through all nested demo frames', () => {
    expect(read('demo-v6.html')).toContain("window.parent.postMessage(m,location.origin)");
    expect(read('demo-v7.html')).toContain("window.parent.postMessage(m,location.origin)");
    expect(read('demo-auth-relay.html')).toContain("message.type==='auth:open'||message.type==='auth:logout'");
    expect(read('demo.html')).toContain("if(m.type==='auth:open')openLogin()");
  });
});
