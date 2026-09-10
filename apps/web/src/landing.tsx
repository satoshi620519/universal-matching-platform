import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './landing.css';
import './landing-polish.css';
import './landing-showcase.css';
import './landing-sales.css';
import './landing-finish.css';
import './landing-final.css';

const useCases = [
  ['01', '恋愛・パートナー', '価値観や目的をもとに、真剣な出会いを求める人をつなぐ。'],
  ['02', '友だち・仲間', '共通の趣味や関心、ライフスタイルから自然なつながりをつくる。'],
  ['03', 'ビジネス', '人脈づくり、業務提携、採用、ビジネスパートナーとの出会いに。'],
  ['04', 'メンター・相談相手', '目標、専門知識、経験、活動時間などをもとに最適な相手をつなぐ。'],
  ['05', 'コミュニティ', '地域、趣味、イベント、テーマなど、目的に合ったコミュニティをつくる。'],
  ['06', 'サービス・仕事', '専門家、クリエイター、フリーランサー、地域の事業者と利用者をつなぐ。'],
];

const featureGroups = [
  ['01', 'マッチング・検索', 'マッチングエンジン、スコアリング、レコメンド、検索、絞り込み、並び替え、カード、リスト、いいね、興味、相互マッチ。'],
  ['02', 'プロフィール・本人確認', 'プロフィール、画像、自己紹介、項目設定、カスタム項目、確認ステータス、プロフィール完成度、公開範囲を柔軟に設定。'],
  ['03', 'メッセージ・通知', '会話、リアルタイムメッセージ、既読、入力中表示、メディア、アプリ内通知、メール・プッシュ通知に対応できる設計。'],
  ['04', '安心・安全', 'ブロック、通報、証拠情報、モデレーション、警告、利用停止、アカウント停止、監査ログ、レート制限、不正対策。'],
  ['05', '管理・分析', 'ユーザー、プロフィール、通報、モデレーション、各種設定、機能管理、多言語、システム状態、サービス分析を管理。'],
  ['06', 'グローバル対応', '国、地域、都市、言語、ロケール、タイムゾーン、距離検索、位置情報の公開範囲まで地域に合わせて設定。'],
  ['07', '決済・拡張', '有料機能、決済連携、API、バージョニング、Webhookなど、将来のサービス拡張を見据えた設計。'],
  ['08', 'Web / iOS / Android', 'Webのレスポンシブ対応に加え、iOS・Androidにも展開できる共通のプロダクト基盤。'],
];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function MiniProduct() {
  return <div className="salesProduct">
    <div className="salesProductBar"><span>NEXA / マッチング</span><span>ライブプレビュー</span></div>
    <div className="salesProductMain">
      <div className="salesProfileVisual"><div className="orbit orbitA"/><div className="orbit orbitB"/><div className="person personOne">A</div><div className="person personTwo">M</div><div className="person personThree">L</div><span className="visualLabel">人 / 目的 / 場所</span></div>
      <div className="salesProductInfo"><span className="micro">あなたの次のつながり</span><h3>98%<em> マッチ</em></h3><p>共通の興味<br/>目的 · 背景 · 意思</p><div className="signal"><i/><i/><i/><i/><i/></div><button type="button" onClick={() => scrollTo('demo')}>デモを開く <b>↘</b></button></div>
    </div>
    <div className="salesProductFoot"><span>プライバシー設計</span><span>ルールを設定可能</span><span>市場に合わせて構築</span></div>
  </div>;
}

const profiles = [
  { name: 'Mika', role: 'クリエイター', place: '東京', tags: ['写真', '旅行', 'デザイン'], score: 96, initial: 'M', online: true },
  { name: 'Alex', role: 'プロダクトマネージャー', place: '大阪', tags: ['起業', '音楽', 'カフェ'], score: 91, initial: 'A', online: true },
  { name: 'Lina', role: 'フリーランサー', place: '京都', tags: ['アート', '旅', 'コミュニティ'], score: 98, initial: 'L', online: false },
  { name: 'Noah', role: 'コミュニティ運営', place: '横浜', tags: ['読書', 'イベント', '地域'], score: 94, initial: 'N', online: true },
];

const demoNav = [
  ['discover', '探す', '⌕'], ['matches', 'マッチ', '♡'], ['messages', 'メッセージ', '▱'], ['notifications', '通知', '◌'], ['profile', 'プロフィール', '◎'], ['safety', '安心・安全', '◇'], ['global', '地域・言語', '◍'], ['settings', '設定', '⚙'],
];

function FullProductDemo() {
  const [view, setView] = useState('discover');
  const [category, setCategory] = useState('すべて');
  const [profileIndex, setProfileIndex] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [blocked, setBlocked] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [language, setLanguage] = useState('日本語');
  const [region, setRegion] = useState('日本');
  const [safeMode, setSafeMode] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const profile = profiles[profileIndex % profiles.length];
  const currentId = profileIndex % profiles.length;
  const isLiked = liked.includes(currentId);
  const isMatched = matched.includes(currentId);

  const next = () => setProfileIndex((v) => (v + 1) % profiles.length);
  const like = () => {
    if (!liked.includes(currentId)) setLiked((v) => [...v, currentId]);
    setMatched((v) => v.includes(currentId) ? v : [...v, currentId]);
  };
  const send = () => {
    if (!message.trim()) return;
    setSent((v) => [...v, message.trim()]);
    setMessage('');
  };
  const matchCount = matched.length;
  const engagement = useMemo(() => 74 + matched.length * 6 + liked.length * 2, [matched.length, liked.length]);

  const renderPanel = () => {
    if (view === 'discover') return <>
      <div className="fp-toolbar"><div><span className="fp-kicker">RECOMMENDED</span><h3>あなたに合う相手</h3></div><button className={filterOpen ? 'fp-filter active' : 'fp-filter'} onClick={() => setFilterOpen(!filterOpen)}>絞り込み <span>☷</span></button></div>
      {filterOpen && <div className="fp-filterbar"><button className={category === 'すべて' ? 'selected' : ''} onClick={() => setCategory('すべて')}>すべて</button><button className={category === '恋愛' ? 'selected' : ''} onClick={() => setCategory('恋愛')}>恋愛</button><button className={category === '友だち' ? 'selected' : ''} onClick={() => setCategory('友だち')}>友だち</button><button className={category === '仕事' ? 'selected' : ''} onClick={() => setCategory('仕事')}>仕事</button><button className={category === '趣味' ? 'selected' : ''} onClick={() => setCategory('趣味')}>趣味</button></div>}
      <div className={isMatched ? 'fp-profile matched' : 'fp-profile'}>
        <div className="fp-avatar"><span>{profile.initial}</span><i className={profile.online ? 'online' : ''}/></div>
        <div className="fp-main"><span className="fp-online">{profile.online ? '● オンライン' : '○ 最近アクティブ'}</span><h4>{profile.name}</h4><p>{profile.role} · {profile.place}</p><div className="fp-tags">{profile.tags.map(t => <span key={t}>{t}</span>)}</div></div>
        <div className="fp-score"><strong>{profile.score}%</strong><small>相性</small></div>
        {isMatched && <div className="fp-match">MATCH</div>}
      </div>
      <div className="fp-actions"><button onClick={() => { setBlocked(v => [...v, currentId]); next(); }}>スキップ</button><button className="primary" onClick={like}>{isMatched ? '✓ MATCH成立' : '♡ いいね'}</button><button onClick={next}>次へ →</button></div>
      <div className="fp-stats"><span>候補 <b>{profiles.length}</b></span><span>いいね <b>{liked.length}</b></span><span>マッチ <b>{matchCount}</b></span><span>安全モード <b>{safeMode ? 'ON' : 'OFF'}</b></span></div>
    </>;
    if (view === 'matches') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">CONNECTIONS</span><h3>マッチ一覧</h3></div><span className="fp-count">{matchCount} 件</span></div><div className="fp-list">{profiles.filter((_,i)=>matched.includes(i)).map(p=><article key={p.name}><div className="fp-miniavatar">{p.initial}</div><div><b>{p.name}</b><span>{p.role} · {p.place}</span></div><button onClick={()=>setView('messages')}>メッセージ</button></article>)}{matchCount===0&&<div className="fp-empty">「いいね」を押すと、ここにマッチした相手が表示されます。</div>}</div></div>;
    if (view === 'messages') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">MESSAGES</span><h3>メッセージ</h3></div><span className="fp-status">安全な会話</span></div><div className="fp-chat"><div className="fp-chat-head"><div className="fp-miniavatar">{profile.initial}</div><div><b>{profile.name}</b><span>オンライン</span></div></div><div className="fp-bubbles"><div className="them">こんにちは。プロフィールを見てくれてありがとう。</div>{sent.map((s,i)=><div className="mine" key={`${s}-${i}`}>{s}</div>)}</div><div className="fp-compose"><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="メッセージを入力…"/><button onClick={send}>送信</button></div></div></div>;
    if (view === 'notifications') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">ACTIVITY</span><h3>通知</h3></div><button className="fp-textbtn" onClick={()=>setNotifications(0)}>すべて既読</button></div><div className="fp-list"><article><div className="fp-notifyIcon">♡</div><div><b>新しいマッチ</b><span>Mikaさんとマッチしました。</span></div><em>たった今</em></article><article><div className="fp-notifyIcon">✦</div><div><b>おすすめ</b><span>あなたと96%相性のプロフィールがあります。</span></div><em>8分前</em></article><article><div className="fp-notifyIcon">✓</div><div><b>安全確認</b><span>プロフィールの安全設定が有効です。</span></div><em>今日</em></article></div></div>;
    if (view === 'profile') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">MY PROFILE</span><h3>プロフィール</h3></div><span className="fp-progress">92% 完成</span></div><div className="fp-own"><div className="fp-ownavatar">S</div><div><h4>Satoshi</h4><p>クリエイター · 日本</p><div className="fp-tags"><span>デザイン</span><span>プロダクト</span><span>旅行</span></div></div></div><div className="fp-settingsgrid"><button onClick={()=>alert('プロフィール編集デモ')}>プロフィールを編集 <b>→</b></button><button onClick={()=>alert('公開範囲設定デモ')}>公開範囲 <b>公開</b></button><button onClick={()=>alert('本人確認フローのデモ')}>本人確認 <b>認証済み ✓</b></button><button onClick={()=>alert('写真・ギャラリー設定デモ')}>写真・ギャラリー <b>6枚</b></button></div></div>;
    if (view === 'safety') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">TRUST & SAFETY</span><h3>安心・安全</h3></div><span className="fp-safe">保護中</span></div><div className="fp-safetygrid"><button onClick={()=>alert('ブロック機能のデモ')}>ブロック <span>相手を非表示</span></button><button onClick={()=>alert('通報フローのデモ')}>通報 <span>理由を選択</span></button><button onClick={()=>setSafeMode(!safeMode)}>安全モード <span>{safeMode?'ON':'OFF'}</span></button><button onClick={()=>alert('プライバシー設定のデモ')}>プライバシー <span>位置情報を保護</span></button></div><div className="fp-safety-note">プロフィール、通報、ブロック、公開範囲、位置情報などをサービスごとに設定できます。</div></div>;
    if (view === 'global') return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">GLOBAL</span><h3>地域・言語</h3></div><span className="fp-status">地域対応</span></div><div className="fp-global"><label>表示言語<select value={language} onChange={e=>setLanguage(e.target.value)}><option>日本語</option><option>English</option><option>한국어</option><option>中文</option></select></label><label>利用地域<select value={region} onChange={e=>setRegion(e.target.value)}><option>日本</option><option>米国</option><option>EU</option><option>東南アジア</option></select></label></div><div className="fp-regioncards"><span>国 / 地域 <b>{region}</b></span><span>言語 <b>{language}</b></span><span>タイムゾーン <b>JST</b></span></div></div>;
    return <div className="fp-page"><div className="fp-toolbar"><div><span className="fp-kicker">SETTINGS</span><h3>設定</h3></div><span className="fp-status">保存済み</span></div><div className="fp-settingrows"><button onClick={()=>setSafeMode(!safeMode)}><span>安全モード</span><b>{safeMode?'ON':'OFF'}</b></button><button onClick={()=>alert('通知設定デモ')}><span>通知設定</span><b>カスタム</b></button><button onClick={()=>alert('表示・アクセシビリティ設定デモ')}><span>表示・アクセシビリティ</span><b>標準</b></button><button onClick={()=>alert('アカウント設定デモ')}><span>アカウント</span><b>管理</b></button></div></div>;
  };

  return <section className="matchingDemo fullProductDemo" id="demo" aria-label="フル機能プロダクトデモ">
    <div className="matchingDemoHeader"><div><span className="salesEyebrow">FULL PRODUCT EXPERIENCE</span><h2>ただ見るだけじゃない。<em>実際に触れる。</em></h2></div><p>購入者が確認したい主要機能を、ひとつの画面にまとめた実機型デモ。探す、マッチ、メッセージ、安全、プロフィール、地域、設定まで実際に操作できます。</p></div>
    <div className="fullProductShell">
      <div className="fp-topbar"><span className="fp-brand"><i>N</i> NEXA</span><span className="fp-demo">INTERACTIVE DEMO <b>{notifications > 0 ? notifications : ''}</b></span><span className="fp-user">Satoshi · Demo</span></div>
      <div className="fp-body">
        <aside className="fp-sidebar"><span className="fp-side-label">PRODUCT</span>{demoNav.map(([id,label,icon])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}><i>{icon}</i><span>{label}</span>{id==='notifications'&&notifications>0?<b>{notifications}</b>:null}</button>)}<div className="fp-side-foot"><span>DEMO MODE</span><b>安全設定 ON</b></div></aside>
        <main className="fp-content">{renderPanel()}</main>
      </div>
    </div>
  </section>;
}

function LandingPage() {
  return <div className="landing salesLanding">
    <header className="landingNav salesNav"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button><nav aria-label="ページナビゲーション"><button type="button" onClick={() => scrollTo('demo')}>デモ</button><button type="button" onClick={() => scrollTo('usecases')}>活用例</button><button type="button" onClick={() => scrollTo('features')}>機能</button><button type="button" onClick={() => scrollTo('customize')}>カスタマイズ</button><button type="button" onClick={() => scrollTo('safety')}>安心・安全</button></nav><button className="navButton" type="button" onClick={() => scrollTo('launch')}>プラットフォームを見る</button></header>
    <main>
      <section className="salesHero" id="top"><div className="heroAmbient"/><div className="heroRings"/><div className="salesHeroCopy"><span className="salesEyebrow"><i/> UNIVERSAL MATCHING PLATFORM</span><h1>ひとつの基盤から。<br/><em>あなたの</em>マッチングサービスへ。</h1><p>そのまま使える洗練されたマッチング基盤。ロゴ、世界観、ルール、対象ユーザー、体験まで変えて、あなただけのサービスへ。</p><div className="salesHeroActions"><button className="salesPrimary" type="button" onClick={() => scrollTo('demo')}>すべての機能を体験する <span>↘</span></button><button className="salesTextButton" type="button" onClick={() => scrollTo('customize')}>そのまま使う。自由に変える。 <span>↓</span></button></div><div className="heroTrust"><span>WEB</span><span>iOS</span><span>ANDROID</span><span>GLOBAL</span></div></div><div className="salesHeroVisual"><MiniProduct/><div className="floatingStat"><strong>8+</strong><span>主要機能を体験</span></div><div className="floatingStat second"><strong>100%</strong><span>ブランド対応</span></div></div><button className="heroScroll" type="button" onClick={() => scrollTo('demo')}>実際のデモを見る <i/></button></section>
      <FullProductDemo />
      <section className="salesIntro" id="intro"><div className="salesSectionTop"><span>01 / コンセプト</span><span>ひとつの用途だけのアプリではない</span></div><div className="introHeadline"><h2>ゼロから<br/><em>始めない。</em></h2><div><p>人と人を目的に合わせてつなぐサービスをつくるための、プレミアムな基盤です。デザイン、プロダクト構造、運用まで考えた土台があるから、購入者はゼロから作り直すのではなく、自分の市場づくりに集中できます。</p><button type="button" onClick={() => scrollTo('features')}>含まれるものを見る <span>↘</span></button></div></div><div className="introManifest"><span>01</span><b>目的を決める</b><span>→</span><b>体験をつくる</b><span>→</span><b>自分のサービスにする</b></div></section>
      <section className="useCaseSection" id="usecases"><div className="sectionHeading"><div><span className="salesEyebrow">02 / ひとつの基盤 · 多くの市場</span><h2>誰と誰を<br/><em>つなぐ？</em></h2></div><p>同じ基盤から、恋愛、友だち、ビジネス、メンター、地域コミュニティ、専門サービスなど、さまざまなマッチングサービスへ展開できます。用途は購入者が決められます。</p></div><div className="useCaseGrid">{useCases.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></article>)}</div></section>
      <section className="featureSection" id="features"><div className="featureIntro"><span className="salesEyebrow">03 / プラットフォーム</span><h2>サービスに必要なものを<br/><em>ひとつの基盤に。</em></h2><p>マッチングだけではありません。プロフィール、メッセージ、通知、安心・安全、管理、分析、グローバル、決済、Web / iOS / Androidまで、サービスとして成立させるための土台をまとめています。</p></div><div className="featureList">{featureGroups.map(([n,t,d]) => <article key={n}><span className="featureNo">{n}</span><div><h3>{t}</h3><p>{d}</p></div><span className="featurePlus">+</span></article>)}</div></section>
      <section className="customSection" id="customize"><div className="customHeader"><span className="salesEyebrow">04 / 自分のサービスへ</span><h2>すぐ使える。<br/><em>方向性は、自分で決める。</em></h2></div><div className="customSplit"><article className="customCard ready"><span className="cardKicker">クイックローンチ</span><div className="cardNumber">01</div><h3>デザインは活かす。<br/><em>ブランドを変える。</em></h3><p>ロゴ、カラー、画像、言語、用語、利用規約・サポート情報などを変更して公開できます。</p><div className="customItems"><span>ロゴ・カラー</span><span>画像・文字デザイン</span><span>言語・地域</span><span>プロフィール項目</span></div></article><article className="customCard developer"><span className="cardKicker">高度なカスタマイズ</span><div className="cardNumber">02</div><h3>ルールを変える。<br/><em>違うサービスにする。</em></h3><p>ソースコードをカスタマイズし、マッチングロジック、プロフィール、導線、API、新機能まで拡張できます。</p><div className="customItems"><span>マッチングアルゴリズム</span><span>機能の表示設定</span><span>API・Webhook</span><span>独自のサービスロジック</span></div></article></div><div className="customBottom"><span>完成するもの</span><strong>購入したサービスの雰囲気を残すことも、自分で作ったようなサービスに変えることもできます。</strong></div></section>
      <section className="safetySection" id="safety"><div className="safetyVisual"><div className="shieldCore">N</div><div className="safetyOrbit o1"/><div className="safetyOrbit o2"/><div className="safetyBadge">安心 / はじめから設計</div></div><div className="safetyCopy"><span className="salesEyebrow">05 / 安心・安全</span><h2>プレミアムとは、<br/><em>責任まで考えること。</em></h2><p>プライバシーと安全性を後付けにしない。最初の利用体験から、通報、モデレーション、管理まで、安心して運営できるサービス設計を目指します。</p><div className="safetyPoints"><span>プライバシー設定</span><span>通報・ブロック</span><span>モデレーション</span><span>監査ログ</span><span>不正・迷惑行為対策</span><span>位置情報の保護</span></div></div></section>
      <section className="globalSection"><div><span className="salesEyebrow">06 / グローバル設計</span><h2>どの市場にも<br/><em>合わせられる。</em></h2></div><div className="globalMap"><div className="mapLines"/><span className="mapPin p1">日本</span><span className="mapPin p2">EU</span><span className="mapPin p3">米国</span><span className="mapPin p4">東南アジア</span><div className="mapCaption"><b>地域に合わせて設定</b><span>国 · 地域 · 都市 · 言語 · タイムゾーン</span></div></div></section>
      <section className="launchSection" id="launch"><div className="launchInner"><span className="salesEyebrow">07 / 次のサービスへ</span><h2>基盤を手に入れる。<br/><em>つながりをつくる。</em></h2><p>本気のマッチングサービスを始めるための、洗練された出発点。そのまま使えて、自由に変えられて、自分のサービスにできます。</p><div className="launchActions"><button className="salesPrimary dark" type="button" onClick={() => scrollTo('demo')}>実際の製品を体験する <span>↗</span></button><button className="salesTextButton darkText" type="button" onClick={() => scrollTo('top')}>トップへ戻る ↑</button></div></div></section>
    </main>
    <footer className="landingFooter salesFooter"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button><span>ユニバーサル・マッチングプラットフォーム · Web · iOS · Android</span><span>© 2026</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);
