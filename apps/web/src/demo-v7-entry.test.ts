import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const entry = readFileSync(resolve(process.cwd(), 'public/demo.html'), 'utf8');
const source = readFileSync(resolve(process.cwd(), 'public/demo-v7.html'), 'utf8');

describe('NEXA buyer-facing demo entry', () => {
  it('keeps the hardened v6 walkthrough as the core experience', () => {
    expect(entry).toContain('src="/demo-v7.html"');
    expect(source).toContain('src="/demo-v6.html"');
  });

  it('exposes direct feature navigation for buyer review', () => {
    expect(source).toContain('候補を見る');
    expect(source).toContain('MATCH一覧');
    expect(source).toContain('メッセージ');
    expect(source).toContain('地域・言語');
    expect(source).toContain('管理・分析');
    expect(source).toContain('Quick Launch');
    expect(source).toContain("go('discover')");
    expect(source).toContain("go('matches')");
    expect(source).toContain("go('messages')");
    expect(source).toContain("go('global')");
    expect(source).toContain("go('admin')");
    expect(source).toContain("go('launch')");
  });

  it('exposes real report and block actions against fictional demo state', () => {
    expect(source).toContain('通報を体験');
    expect(source).toContain('ブロックを体験');
    expect(source).toContain('w().report(x.id)');
    expect(source).toContain('w().block(x.id)');
    expect(source).toContain('w().S.reported.has(p.id)');
    expect(source).toContain('w().S.blocked.has(p.id)');
    expect(source).toContain('安全画面で処理結果を確認できます');
    expect(source).toContain('候補・MATCH対象から除外されます');
  });

  it('provides a demo-only reset without changing the underlying product flow', () => {
    expect(source).toContain('デモをリセット');
    expect(source).toContain('w().location.reload()');
    expect(source).toContain('架空データだけに反映されます');
  });
});
