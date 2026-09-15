import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(process.cwd(), 'public/demo-v5.html'), 'utf8');
const entry = readFileSync(resolve(process.cwd(), 'public/demo.html'), 'utf8');

describe('NEXA guided demo end-to-end walkthrough', () => {
  it('starts at landing and guides user -> profile -> discovery -> profile detail', () => {
    expect(entry).toContain('/demo-v5.html');
    expect(source).toContain('デモを開始する');
    expect(source).toContain("view:'home'");
    expect(source).toContain('function user()');
    expect(source).toContain('S.view=\'user\'');
    expect(source).toContain('ユーザー設定を保存してプロフィールへ');
    expect(source).toContain('function profile()');
    expect(source).toContain('条件検索へ進む');
    expect(source).toContain('名前で検索');
    expect(source).toContain('条件をリセット');
    expect(source).toContain('function detail(id)');
    expect(source).toContain("function go(v,id=null)");
    expect(source).toContain("if(id)S.active=id");
  });

  it('keeps the matching lifecycle explicit: profile -> like -> mutual match -> match list -> message', () => {
    expect(source).toContain("go('detail','${p.id}')");
    expect(source).toContain('function like(id)');
    expect(source).toContain('function mutual(id)');
    expect(source).toContain('S.matches.add(id)');
    expect(source).toContain('function matches()');
    expect(source).toContain('function messages()');
    expect(source).toContain('function send()');
    expect(source).toContain('S.msg[p.id]');
    expect(source).toContain('会話を開く');
  });

  it('includes notification, safety, regional/language, admin and buyer launch surfaces', () => {
    expect(source).toContain('function report(id)');
    expect(source).toContain('function block(id)');
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
