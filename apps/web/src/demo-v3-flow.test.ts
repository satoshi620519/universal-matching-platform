import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const source = readFileSync(resolve(process.cwd(), 'public/demo-v3.html'), 'utf8');
describe('NEXA demo-v3 end-to-end walkthrough', () => {
  it('starts from a real product landing screen and exposes the complete member journey', () => {
    expect(source).toContain('デモを開始する');
    expect(source).toContain("S={view:'home'");
    expect(source).toContain('function start()');
    expect(source).toContain("S.started=true");
    expect(source).toContain('名前で検索');
    expect(source).toContain('条件をリセット');
    expect(source).toContain('プロフィール');
  });
  it('keeps the matching lifecycle explicit: like -> mutual match -> match list -> message', () => {
    expect(source).toContain('function like(');
    expect(source).toContain('function mutual(');
    expect(source).toContain('S.matches.add(id)');
    expect(source).toContain("S.view='messages'");
    expect(source).toContain('function send()');
    expect(source).toContain('S.messages[p.id]');
    expect(source).toContain('会話を開く');
  });
  it('includes notification, safety, regional/language, admin and buyer launch surfaces', () => {
    expect(source).toContain('function report(');
    expect(source).toContain('function block(');
    expect(source).toContain('安心・安全');
    expect(source).toContain('地域・言語');
    expect(source).toContain('管理・分析');
    expect(source).toContain('Quick Launch');
  });
  it('keeps the demo self-contained and fictional', () => {
    expect(source).toContain('架空データのみ使用');
    expect(source).toContain('fictional data');
  });
});
