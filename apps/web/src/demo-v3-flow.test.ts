import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(process.cwd(), 'public/demo-v5.html'), 'utf8');
const entry = readFileSync(resolve(process.cwd(), 'public/demo.html'), 'utf8');
const wrapper = readFileSync(resolve(process.cwd(), 'public/demo-v6.html'), 'utf8');

describe('NEXA guided demo end-to-end walkthrough', () => {
  it('starts at landing and guides user -> profile -> discovery -> profile detail', () => {
    expect(entry).toContain('src="/demo-v6.html"');
    expect(wrapper).toContain('src="/demo-v5.html"');
    expect(source).toContain('デモを開始する');
    expect(source).toContain("view:'home'");
    expect(source).toContain('function user()');
    expect(source).toContain("S.view='user'");
    expect(source).toContain('ユーザー設定を保存してプロフィールへ');
    expect(source).toContain('function profile()');
    expect(source).toContain('条件検索へ進む');
    expect(source).toContain('名前で検索');
    expect(source).toContain('条件をリセット');
    expect(source).toContain('function detail(id)');
    expect(source).toContain('function go(v,id=null)');
    expect(source).toContain('if(id)S.active=id');
  });

  it('keeps the matching lifecycle explicit: profile -> like -> mutual match -> match list -> message', () => {
    expect(source).toContain("go('detail','${p.id}')");
    expect(source).toContain('function like(id)');
    expect(source).toContain('function mutual(id)');
    expect(source).toContain("if(!S.liked.has(id)){toast('先に「いいね」を送ってください');return}");
    expect(source).toContain("if(!S.incoming.has(id)){toast('相手からのいいね待ちです');return}");
    expect(source).toContain('S.matches.add(id)');
    expect(source).toContain('function matches()');
    expect(source).toContain('function messages()');
    expect(source).toContain('function send()');
    expect(source).toContain('S.msg[p.id]');
    expect(source).toContain('会話を開く');
    expect(source).toContain("toast('MATCH成立。会話が解放されました')");
  });

  it('keeps the v6 wrapper persistent controls and reload lifecycle', () => {
    expect(wrapper).toContain('id="progress"');
    expect(wrapper).toContain('id="activity"');
    expect(wrapper).toContain('id="mutual"');
    expect(wrapper).toContain('const frame=document.getElementById(\'frame\')');
    expect(wrapper).toContain('clearInterval(timer)');
    expect(wrapper).toContain('frame.addEventListener(\'load\',bootDemo)');
    expect(wrapper).toContain('w.location.reload()');
  });

  it('shows a live journey status overlay for the actual demo state', () => {
    expect(wrapper).toContain('デモ体験ステータス');
    expect(wrapper).toContain("const steps=[['user','ユーザー設定'],['profile','プロフィール'],['discover','条件検索'],['detail','プロフィール確認'],['liked','LIKE'],['matches','相互MATCH'],['messages','メッセージ'],['safety','安心・安全']]");
    expect(wrapper).toContain('c.liked>0');
    expect(wrapper).toContain('c.matched>0');
    expect(wrapper).toContain('c.messages>0');
    expect(wrapper).toContain('c.reported>0||c.blocked>0');
  });

  it('exposes every major demo surface through persistent shortcuts', () => {
    expect(wrapper).toContain('全機能ショートカット ＋');
    expect(wrapper).toContain("['探す','discover']");
    expect(wrapper).toContain("['マッチ','matches']");
    expect(wrapper).toContain("['メッセージ','messages']");
    expect(wrapper).toContain("['通知','notifications']");
    expect(wrapper).toContain("['プロフィール','profile']");
    expect(wrapper).toContain("['安心・安全','safety']");
    expect(wrapper).toContain("['地域・言語','global']");
    expect(wrapper).toContain("['設定','settings']");
    expect(wrapper).toContain("['管理・分析','admin']");
    expect(wrapper).toContain("['Quick Launch','launch']");
    expect(wrapper).toContain('b.onclick=()=>w.go(t)');
  });

  it('keeps safety actions stateful and removes blocked profiles from discovery', () => {
    expect(source).toContain('function report(id)');
    expect(source).toContain('S.reported.add(id)');
    expect(source).toContain('通報を管理キューへ送信しました');
    expect(source).toContain('function block(id)');
    expect(source).toContain('S.blocked.add(id)');
    expect(source).toContain('S.liked.delete(id)');
    expect(source).toContain('S.matches.delete(id)');
    expect(source).toContain('S.active===id');
    expect(source).toContain('!S.blocked.has(p.id)');
    expect(source).toContain('go(\'discover\')');
    expect(wrapper).toContain('function safety()');
    expect(wrapper).toContain("w.report(x.id)");
    expect(wrapper).toContain("w.go('safety')");
    expect(wrapper).toContain('c.reported>0||c.blocked>0');
  });

  it('keeps notification, regional/language, admin and buyer launch surfaces', () => {
    expect(source).toContain('function notifications()');
    expect(source).toContain('function safety()');
    expect(source).toContain('function global()');
    expect(source).toContain('function settings()');
    expect(source).toContain('function admin()');
    expect(source).toContain('function launch()');
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