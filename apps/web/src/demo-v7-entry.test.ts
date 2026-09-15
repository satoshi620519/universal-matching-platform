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

  it('exposes a guided tour across the buyer-facing feature screens', () => {
    expect(source).toContain('全機能を順番に確認');
    expect(source).toContain("['discover','候補・検索']");
    expect(source).toContain("['matches','MATCH一覧']");
    expect(source).toContain("['messages','メッセージ']");
    expect(source).toContain("['notifications','通知']");
    expect(source).toContain("['safety','安心・安全']");
    expect(source).toContain("['global','地域・言語']");
    expect(source).toContain("['admin','管理・分析']");
    expect(source).toContain("['launch','Quick Launch']");
    expect(source).toContain('全機能ツアーが完了しました');
  });

  it('exposes one-click mutual matching against fictional demo state', () => {
    expect(source).toContain('相互MATCHを体験');
    expect(source).toContain('w().S.incoming.add(x.id)');
    expect(source).toContain('w().like(x.id)');
    expect(source).toContain('w().mutual(x.id)');
    expect(source).toContain("w().go('matches')");
    expect(source).toContain('MATCHが成立しました');
  });

  it('exposes one-click message sending after a demo match', () => {
    expect(source).toContain('メッセージ送信を体験');
    expect(source).toContain('w().S.active=x.id');
    expect(source).toContain("w().go('messages')");
    expect(source).toContain("querySelector('iframe#frame')");
    expect(source).toContain("getElementById('message')");
    expect(source).toContain('inner.send()');
    expect(source).toContain('メッセージを送信しました');
  });

  it('exposes post-match notification verification against fictional demo state', () => {
    expect(source).toContain('MATCH後の通知を確認');
    expect(source).toContain("w().go('notifications')");
    expect(source).toContain('MATCH成立通知を確認できます');
  });

  it('exposes a one-click end-to-end match, message, and notification journey', () => {
    expect(source).toContain('MATCH→メッセージ→通知');
    expect(source).toContain("input.value='こんにちは！MATCH成立後のメッセージです。'");
    expect(source).toContain('inner.send()');
    expect(source).toContain("w().go('notifications')");
    expect(source).toContain('MATCH成立 → メッセージ送信 → 通知確認まで完了しました');
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
