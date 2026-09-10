import React, { useEffect, useState } from 'react';
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
      <div className="salesProductInfo"><span className="micro">あなたの次のつながり</span><h3>98%<em> マッチ</em></h3><p>共通の興味<br/>目的 · 背景 · 意思</p><div className="signal"><i/><i/><i/><i/><i/></div><button type="button" onClick={() => scrollTo('features')}>システムを見る <b>↗</b></button></div>
    </div>
    <div className="salesProductFoot"><span>プライバシー設計</span><span>ルールを設定可能</span><span>市場に合わせて構築</span></div>
  </div>;
}

const demoProfiles = [
  { name: 'Mika', role: 'クリエイター', place: '東京', tags: ['写真', '旅行', 'デザイン'], score: 96, initial: 'M' },
  { name: 'Alex', role: 'プロダクトマネージャー', place: '大阪', tags: ['起業', '音楽', 'カフェ'], score: 91, initial: 'A' },
  { name: 'Lina', role: 'フリーランサー', place: '京都', tags: ['アート', '旅', 'コミュニティ'], score: 98, initial: 'L' },
];

function MatchingExperienceDemo() {
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const profile = demoProfiles[index];

  useEffect(() => {
    if (matched) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % demoProfiles.length), 4200);
    return () => window.clearTimeout(timer);
  }, [index, matched]);

  const nextProfile = () => {
    setMatched(false);
    setIndex((value) => (value + 1) % demoProfiles.length);
  };

  return <section className="matchingDemo" aria-label="マッチング体験デモ">
    <div className="matchingDemoHeader">
      <div><span className="salesEyebrow">LIVE PRODUCT EXPERIENCE</span><h2>実際のマッチングを、<em>ここで体験。</em></h2></div>
      <p>購入前に、ユーザーが「探す → 選ぶ → マッチする → つながる」体験をイメージできる、製品内蔵型のデモです。</p>
    </div>
    <div className="matchingDemoShell">
      <div className="matchingDemoTop"><span><i/> DEMO / MATCHING</span><span>安全なプロフィール体験</span></div>
      <div className="matchingDemoBody">
        <aside className="matchingDemoSide"><span className="demoStepLabel">MATCHING FLOW</span><div className="demoSteps"><b className="active">01 <span>探す</span></b><b className={matched ? 'active' : ''}>02 <span>選ぶ</span></b><b className={matched ? 'active' : ''}>03 <span>マッチ</span></b><b className={matched ? 'active' : ''}>04 <span>つながる</span></b></div><div className="demoFilter"><span>目的</span><strong>共通点の多い人</strong><span>地域</span><strong>日本 · 近くの地域</strong></div></aside>
        <div className="demoProfileStage">
          <div className="demoStageMeta"><span>おすすめ</span><span>{index + 1} / {demoProfiles.length}</span></div>
          <article className={matched ? 'demoProfile matched' : 'demoProfile'}>
            <div className="demoAvatar"><div className="demoAvatarGlow"/><span>{profile.initial}</span></div>
            <div className="demoProfileCopy"><span className="demoOnline">● オンライン</span><h3>{profile.name}</h3><p>{profile.role} · {profile.place}</p><div className="demoTags">{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            <div className="demoScore"><strong>{profile.score}%</strong><span>相性</span></div>
          </article>
          <div className="demoActions">
            <button type="button" className="demoPass" onClick={nextProfile} aria-label="次のプロフィール">×</button>
            <button type="button" className="demoLike" onClick={() => setMatched(true)}>{matched ? 'MATCHED' : '♡ いいね'}</button>
            <button type="button" className="demoPass" onClick={nextProfile} aria-label="次のプロフィール">→</button>
          </div>
          {matched && <div className="demoMatchNotice"><span>✓</span><div><strong>MATCHED</strong><p>お互いの興味が一致しました。メッセージを始められます。</p></div><button type="button" onClick={() => setMatched(false)}>もう一度見る</button></div>}
        </div>
      </div>
      <div className="matchingDemoBottom"><span>リアルタイム・デモ</span><span>相性スコア</span><span>プロフィール</span><span>マッチ成立</span></div>
    </div>
  </section>;
}

function LandingPage() {
  return <div className="landing salesLanding">
    <header className="landingNav salesNav">
      <button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button>
      <nav aria-label="ページナビゲーション"><button type="button" onClick={() => scrollTo('usecases')}>活用例</button><button type="button" onClick={() => scrollTo('features')}>機能</button><button type="button" onClick={() => scrollTo('customize')}>カスタマイズ</button><button type="button" onClick={() => scrollTo('safety')}>安心・安全</button></nav>
      <button className="navButton" type="button" onClick={() => scrollTo('launch')}>プラットフォームを見る</button>
    </header>

    <main>
      <section className="salesHero" id="top">
        <div className="heroAmbient"/><div className="heroRings"/>
        <div className="salesHeroCopy"><span className="salesEyebrow"><i/> UNIVERSAL MATCHING PLATFORM</span><h1>ひとつの基盤から。<br/><em>あなたの</em>マッチングサービスへ。</h1><p>そのまま使える洗練されたマッチング基盤。ロゴ、世界観、ルール、対象ユーザー、体験まで変えて、あなただけのサービスへ。</p><div className="salesHeroActions"><button className="salesPrimary" type="button" onClick={() => scrollTo('demo')}>マッチングを体験する <span>↘</span></button><button className="salesTextButton" type="button" onClick={() => scrollTo('customize')}>そのまま使う。自由に変える。 <span>↓</span></button></div><div className="heroTrust"><span>WEB</span><span>iOS</span><span>ANDROID</span><span>GLOBAL</span></div></div>
        <div className="salesHeroVisual"><MiniProduct/><div className="floatingStat"><strong>6+</strong><span>マッチング用途</span></div><div className="floatingStat second"><strong>100%</strong><span>ブランド対応</span></div></div>
        <button className="heroScroll" type="button" onClick={() => scrollTo('intro')}>スクロールして見る <i/></button>
      </section>

      <MatchingExperienceDemo />

      <section className="salesIntro" id="intro"><div className="salesSectionTop"><span>01 / コンセプト</span><span>ひとつの用途だけのアプリではない</span></div><div className="introHeadline"><h2>ゼロから<br/><em>始めない。</em></h2><div><p>人と人を目的に合わせてつなぐサービスをつくるための、プレミアムな基盤です。デザイン、プロダクト構造、運用まで考えた土台があるから、購入者はゼロから作り直すのではなく、自分の市場づくりに集中できます。</p><button type="button" onClick={() => scrollTo('features')}>含まれるものを見る <span>↘</span></button></div></div><div className="introManifest"><span>01</span><b>目的を決める</b><span>→</span><b>体験をつくる</b><span>→</span><b>自分のサービスにする</b></div></section>

      <section className="useCaseSection" id="usecases"><div className="sectionHeading"><div><span className="salesEyebrow">02 / ひとつの基盤 · 多くの市場</span><h2>誰と誰を<br/><em>つなぐ？</em></h2></div><p>同じ基盤から、恋愛、友だち、ビジネス、メンター、地域コミュニティ、専門サービスなど、さまざまなマッチングサービスへ展開できます。用途は購入者が決められます。</p></div><div className="useCaseGrid">{useCases.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></article>)}</div></section>

      <section className="featureSection" id="features"><div className="featureIntro"><span className="salesEyebrow">03 / プラットフォーム</span><h2>サービスに必要なものを<br/><em>ひとつの基盤に。</em></h2><p>曖昧な「マッチングアプリ」ではありません。プロダクト、安心・安全、運用、グローバル対応、カスタマイズまで、サービスとして成立させるための土台を見える形にしています。</p></div><div className="featureList">{featureGroups.map(([n,t,d]) => <article key={n}><span className="featureNo">{n}</span><div><h3>{t}</h3><p>{d}</p></div><span className="featurePlus">+</span></article>)}</div></section>

      <section className="customSection" id="customize"><div className="customHeader"><span className="salesEyebrow">04 / 自分のサービスへ</span><h2>すぐ使える。<br/><em>方向性は、自分で決める。</em></h2></div><div className="customSplit"><article className="customCard ready"><span className="cardKicker">クイックローンチ</span><div className="cardNumber">01</div><h3>デザインは活かす。<br/><em>ブランドを変える。</em></h3><p>すぐにサービスを始めたい購入者向け。ロゴ、カラー、画像、言語、用語、利用規約・サポート情報などを変更して公開できます。</p><div className="customItems"><span>ロゴ・カラー</span><span>画像・文字デザイン</span><span>言語・地域</span><span>プロフィール項目</span></div></article><article className="customCard developer"><span className="cardKicker">高度なカスタマイズ</span><div className="cardNumber">02</div><h3>ルールを変える。<br/><em>違うサービスにする。</em></h3><p>開発チームを持つ購入者向け。ソースコードをカスタマイズし、マッチングロジック、プロフィール、導線、API、新機能まで自由に拡張できます。</p><div className="customItems"><span>マッチングアルゴリズム</span><span>機能の表示設定</span><span>API・Webhook</span><span>独自のサービスロジック</span></div></article></div><div className="customBottom"><span>完成するもの</span><strong>購入したサービスの雰囲気を残すことも、自分で作ったようなサービスに変えることもできます。</strong></div></section>

      <section className="safetySection" id="safety"><div className="safetyVisual"><div className="shieldCore">N</div><div className="safetyOrbit o1"/><div className="safetyOrbit o2"/><div className="safetyBadge">安心 / はじめから設計</div></div><div className="safetyCopy"><span className="salesEyebrow">05 / 安心・安全</span><h2>プレミアムとは、<br/><em>責任まで考えること。</em></h2><p>プライバシーと安全性を後付けにしない。最初の利用体験から、通報、モデレーション、管理まで、安心して運営できるサービス設計を目指します。</p><div className="safetyPoints"><span>プライバシー設定</span><span>通報・ブロック</span><span>モデレーション</span><span>監査ログ</span><span>不正・迷惑行為対策</span><span>位置情報の保護</span></div></div></section>

      <section className="globalSection"><div><span className="salesEyebrow">06 / グローバル設計</span><h2>どの市場にも<br/><em>合わせられる。</em></h2></div><div className="globalMap"><div className="mapLines"/><span className="mapPin p1">日本</span><span className="mapPin p2">EU</span><span className="mapPin p3">米国</span><span className="mapPin p4">東南アジア</span><div className="mapCaption"><b>地域に合わせて設定</b><span>国 · 地域 · 都市 · 言語 · タイムゾーン</span></div></div></section>

      <section className="launchSection" id="launch"><div className="launchInner"><span className="salesEyebrow">07 / 次のサービスへ</span><h2>基盤を手に入れる。<br/><em>つながりをつくる。</em></h2><p>本気のマッチングサービスを始めるための、洗練された出発点。そのまま使えて、自由に変えられて、自分のサービスにできます。</p><div className="launchActions"><button className="salesPrimary dark" type="button" onClick={() => scrollTo('features')}>すべての機能を見る <span>↗</span></button><button className="salesTextButton darkText" type="button" onClick={() => scrollTo('top')}>トップへ戻る ↑</button></div></div></section>
    </main>
    <footer className="landingFooter salesFooter"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button><span>ユニバーサル・マッチングプラットフォーム · Web · iOS · Android</span><span>© 2026</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);