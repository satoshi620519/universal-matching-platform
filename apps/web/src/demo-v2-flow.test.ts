import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const demoPath = resolve(process.cwd(), 'public/demo-v2.html');
const source = readFileSync(demoPath, 'utf8');

describe('NEXA demo-v2 interaction contract', () => {
  it('keeps like and mutual match as separate states', () => {
    expect(source).toContain("state.liked.add(p.id)");
    expect(source).toContain("state.matches.add(id)");
    expect(source).toContain("if(!state.liked.has(id))");

    const likeBody = source.match(/function like\(\)\{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(likeBody).toContain('state.liked.add(p.id)');
    expect(likeBody).not.toContain('state.matches.add');
  });

  it('keeps safety actions connected to candidate state and moderation feedback', () => {
    expect(source).toContain('state.blocked.add(p.id)');
    expect(source).toContain('state.liked.delete(p.id)');
    expect(source).toContain('state.matches.delete(p.id)');
    expect(source).toContain('state.notifications++');
    expect(source).toContain('管理キューへ送信しました');
  });

  it('keeps Quick Launch as a ten-step publish gate', () => {
    expect(source).toContain("const launchItems=['ブランド名・ロゴ','カラー・画像','対象地域','言語・用語','カテゴリ','プロフィール項目','マッチングルール','安全・通報方針','通知設定','利用規約・サポート']");
    expect(source).toContain('launchItems.length');
    expect(source).toContain('state.config.published=true');
    expect(source).toContain('公開内容を見る');
  });
});
