import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const demoPath = resolve(process.cwd(), 'public/demo-v2.html');
const source = readFileSync(demoPath, 'utf8');

describe('NEXA demo-v2 interaction contract', () => {
  it('keeps like and mutual match as separate states', () => {
    expect(source).toContain('state.liked.add(p.id)');
    expect(source).toContain('state.matches.add(id)');
    expect(source).toContain('if(!state.liked.has(id))');

    const likeStart = source.indexOf('function like()');
    const likeEnd = source.indexOf('function mutual(', likeStart);
    const likeBody = likeStart >= 0 && likeEnd > likeStart ? source.slice(likeStart, likeEnd) : '';
    expect(likeBody).toContain('state.liked.add(p.id)');
    expect(likeBody).not.toContain('state.matches.add');
  });

  it('requires both an outgoing and incoming like before mutual match', () => {
    const mutualStart = source.indexOf('function mutual(');
    const mutualEnd = source.indexOf('function next()', mutualStart);
    const mutualBody = mutualStart >= 0 && mutualEnd > mutualStart ? source.slice(mutualStart, mutualEnd) : '';
    expect(mutualBody).toContain('if(!state.liked.has(id))');
    expect(mutualBody).toContain('if(!state.incoming.has(id))');
    expect(mutualBody).toContain('state.matches.add(id)');
  });

  it('requires an established mutual match before messaging', () => {
    const messageStart = source.indexOf('function messages()');
    const messageEnd = source.indexOf('function notifications()', messageStart);
    const messageBody = messageStart >= 0 && messageEnd > messageStart ? source.slice(messageStart, messageEnd) : '';
    expect(messageBody).toContain('const p=matchedProfile()');
    expect(messageBody).toContain('if(!p)');
    expect(messageBody).toContain('メッセージはMATCH成立後に解放されます');
    expect(messageBody).toContain('${esc(p.name)}');
    expect(messageBody).not.toContain('<b>Mika</b>');

    const sendStart = source.indexOf('function send()');
    const sendEnd = source.indexOf('function resetDemo()', sendStart);
    const sendBody = sendStart >= 0 && sendEnd > sendStart ? source.slice(sendStart, sendEnd) : '';
    expect(sendBody).toContain('const p=matchedProfile()');
    expect(sendBody).toContain('if(!p)');
    expect(sendBody).toContain('マッチ成立後にメッセージを開始できます');
    expect(sendBody).toContain('profileId:p.id');
  });

  it('routes message navigation to the selected match', () => {
    expect(source).toContain('function go(v,id){state.view=v;if(id)state.activeMatch=id;render()}');
    expect(source).toContain("onclick=\"go('messages','${p.id}')\"");
    expect(source).toContain('state.activeMatch=id');
  });

  it('keeps blocked candidates excluded from discovery', () => {
    const candidatesStart = source.indexOf('function candidates()');
    const candidatesEnd = source.indexOf('function current()', candidatesStart);
    const candidatesBody = candidatesStart >= 0 && candidatesEnd > candidatesStart ? source.slice(candidatesStart, candidatesEnd) : '';
    expect(candidatesBody).toContain('profiles.filter(p=>!state.blocked.has(p.id)');
    expect(candidatesBody).toContain("state.category==='すべて'");
  });

  it('keeps safety actions connected to candidate state and moderation feedback', () => {
    expect(source).toContain('state.blocked.add(p.id)');
    expect(source).toContain('state.liked.delete(p.id)');
    expect(source).toContain('state.matches.delete(p.id)');
    expect(source).toContain('state.notifications++');
    expect(source).toContain('管理キューへ送信しました');
  });

  it('keeps Quick Launch as a ten-step publish gate', () => {
    expect(source).toContain("const launchItems=[['brand','ブランド名・ロゴ'],['color','カラー・画像'],['region','対象地域'],['language','言語・用語'],['category','カテゴリ'],['profile','プロフィール項目'],['rules','マッチングルール'],['safety','安全・通報方針'],['notify','通知設定'],['legal','利用規約・サポート']]");
    expect(source).toContain('Object.fromEntries(launchItems)');
    expect(source).toContain('state.config.steps.size<10');
    expect(source).toContain('state.config.published=true');
    expect(source).toContain('公開内容を見る');
  });

  it('makes every Quick Launch step editable and persisted in demo state', () => {
    const configureStart = source.indexOf('function configure(key)');
    const configureEnd = source.indexOf('function publish()', configureStart);
    const configureBody = configureStart >= 0 && configureEnd > configureStart ? source.slice(configureStart, configureEnd) : '';
    expect(configureBody).toContain('const labels=Object.fromEntries(launchItems)');
    expect(configureBody).toContain('const defaults=');
    for (const key of ['brand','color','region','language','category']) {
      expect(configureBody).toContain(`key==='${key}'`);
    }
    expect(configureBody).toContain("else state.config[key]=v||'設定済み'");
    expect(configureBody).toContain('state.config.steps.add(key)');
    expect(source).toContain("${state.config.steps.has(k)?'編集':'設定'}");
    expect(source).toContain("設定済み · ${esc(state.config[k]||'反映済み')}");
  });
});
