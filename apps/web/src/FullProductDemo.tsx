import React, { useMemo, useState } from 'react';
import './full-product-demo.css';

type View = 'discover' | 'matches' | 'messages' | 'notifications' | 'profile' | 'safety' | 'global';

type Candidate = {
  name: string;
  role: string;
  region: string;
  language: string;
  score: number;
  tags: string[];
  initial: string;
  online: boolean;
};

const candidates: Candidate[] = [
  { name: 'Mika', role: 'クリエイター', region: '東京', language: '日本語', score: 96, tags: ['写真', '旅行', 'デザイン'], initial: 'M', online: true },
  { name: 'Alex', role: 'プロダクトマネージャー', region: '大阪', language: '日本語 / English', score: 91, tags: ['起業', '音楽', 'カフェ'], initial: 'A', online: true },
  { name: 'Lina', role: 'フリーランサー', region: '京都', language: '日本語 / English', score: 98, tags: ['アート', '旅', 'コミュニティ'], initial: 'L', online: false },
];

const navigation: Array<{ id: View; label: string }> = [
  { id: 'discover', label: '探す' },
  { id: 'matches', label: 'マッチ' },
  { id: 'messages', label: 'メッセージ' },
  { id: 'notifications', label: '通知' },
  { id: 'profile', label: 'プロフィール' },
  { id: 'safety', label: '安心・安全' },
  { id: 'global', label: '地域・言語' },
];

export default function FullProductDemo() {
  const [view, setView] = useState<View>('discover');
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const [category, setCategory] = useState('すべて');
  const [region, setRegion] = useState('日本');
  const [language, setLanguage] = useState('日本語');
  const [safeMode, setSafeMode] = useState(true);
  const [notice, setNotice] = useState('');

  const candidate = candidates[candidateIndex];
  const isLiked = liked.includes(candidate.name);
  const isMatched = matched.includes(candidate.name);
  const matchCount = matched.length;

  const nextCandidate = () => {
    setCandidateIndex((index) => (index + 1) % candidates.length);
    setNotice('');
  };

  const likeCandidate = () => {
    if (!isLiked) setLiked((items) => [...items, candidate.name]);
    if (candidateIndex === 1 || isLiked) {
      setMatched((items) => (items.includes(candidate.name) ? items : [...items, candidate.name]));
      setNotice(`${candidate.name}さんとマッチしました。メッセージを開始できます。`);
    } else {
      setNotice('いいねを送信しました。相手からの反応を待っています。');
    }
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !isMatched) return;
    setSentMessages((items) => [...items, trimmed]);
    setMessage('');
    setNotice('メッセージを送信しました。');
  };

  const summary = useMemo(() => `${liked.length} likes · ${matchCount} matches`, [liked.length, matchCount]);

  return (
    <section className="fp-shell" aria-label="NEXA interactive product demo">
      <header className="fp-shell-header">
        <div><strong>NEXA</strong><span>UNIVERSAL MATCHING</span></div>
        <div className="fp-shell-status">LIVE DEMO · {summary}</div>
      </header>

      <div className="fp-shell-layout">
        <aside className="fp-shell-nav" aria-label="Demo navigation">
          {navigation.map((item) => (
            <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)} type="button">
              {item.label}
            </button>
          ))}
        </aside>

        <main className="fp-shell-main">
          {notice && <div className="fp-shell-notice" role="status">{notice}</div>}

          {view === 'discover' && (
            <>
              <div className="fp-shell-toolbar">
                <div><small>RECOMMENDED FOR YOU</small><h3>あなたに合う相手</h3></div>
                <div className="fp-shell-chips">{['すべて', '恋愛', '仕事', 'スキル', 'コミュニティ'].map((item) => <button type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
              </div>
              <article className="fp-shell-candidate">
                <div className="fp-shell-avatar"><span>{candidate.initial}</span><i className={candidate.online ? 'online' : ''} /></div>
                <div className="fp-shell-candidate-copy"><small>{candidate.online ? '● オンライン' : '○ 最近アクティブ'}</small><h4>{candidate.name}</h4><p>{candidate.role} · {candidate.region}</p><div>{candidate.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><small>{candidate.language}</small></div>
                <div className="fp-shell-score"><strong>{candidate.score}%</strong><span>相性</span></div>
              </article>
              <div className="fp-shell-actions"><button type="button" onClick={nextCandidate}>スキップ</button><button type="button" className="primary" onClick={likeCandidate}>{isMatched ? '✓ MATCH成立' : isLiked ? '✓ いいね済み' : '♡ いいね'}</button><button type="button" onClick={nextCandidate}>次へ →</button></div>
              <div className="fp-shell-metrics"><span>候補 <b>{candidates.length}</b></span><span>いいね <b>{liked.length}</b></span><span>マッチ <b>{matchCount}</b></span><span>安全モード <b>{safeMode ? 'ON' : 'OFF'}</b></span></div>
            </>
          )}

          {view === 'matches' && <div className="fp-shell-panel"><small>YOUR CONNECTIONS</small><h3>マッチ一覧</h3>{matched.length ? matched.map((name) => <button type="button" key={name} onClick={() => setView('messages')}>{name} · メッセージを開く →</button>) : <p>まだマッチはありません。探す画面からいいねを送ってください。</p>}</div>}
          {view === 'messages' && <div className="fp-shell-panel"><small>CONVERSATIONS</small><h3>メッセージ</h3>{isMatched ? <><p>{candidate.name}さんとの会話</p>{sentMessages.map((item, index) => <div key={`${item}-${index}`} className="fp-shell-message">{item}</div>)}<div className="fp-shell-composer"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="メッセージを入力" /><button type="button" onClick={sendMessage}>送信</button></div></> : <p>マッチ成立後にメッセージを開始できます。</p>}</div>}
          {view === 'notifications' && <div className="fp-shell-panel"><small>ACTIVITY</small><h3>通知</h3><p>新しいおすすめが3件あります。</p><p>安全設定が有効です。</p><p>プロフィールの確認ステータスは良好です。</p></div>}
          {view === 'profile' && <div className="fp-shell-panel"><small>YOUR PROFILE</small><h3>Satoshi</h3><p>プロダクトとデザインが好きです。</p><p>プロフィール完成度 · 86%</p><button type="button" onClick={() => setNotice('プロフィール編集モードはデモ表示です。')}>プロフィールを編集</button></div>}
          {view === 'safety' && <div className="fp-shell-panel"><small>TRUST & SAFETY</small><h3>安心・安全</h3><label><input type="checkbox" checked={safeMode} onChange={(event) => setSafeMode(event.target.checked)} /> 安全モードを有効にする</label><p>通報・ブロック・公開範囲・確認ステータスを管理する想定の画面です。</p></div>}
          {view === 'global' && <div className="fp-shell-panel"><small>REGION & LANGUAGE</small><h3>地域・言語</h3><label>地域<select value={region} onChange={(event) => setRegion(event.target.value)}><option>日本</option><option>韓国</option><option>アメリカ</option><option>イギリス</option></select></label><label>言語<select value={language} onChange={(event) => setLanguage(event.target.value)}><option>日本語</option><option>English</option><option>한국어</option></select></label><p>選択中：{region} · {language}</p></div>}
        </main>
      </div>
    </section>
  );
}
