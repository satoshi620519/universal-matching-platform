import React from "react";

const useCases = [
  ["01", "恋愛", "価値観・距離・目的"],
  ["02", "ビジネス", "採用・提携・人脈"],
  ["03", "スキル", "専門家・相談・依頼"],
  ["04", "コミュニティ", "地域・趣味・イベント"],
  ["05", "サービス", "事業者・利用者"],
  ["06", "あなたの市場", "ルールを自由に設計"],
];

const capabilities = [
  "Matching", "Profiles", "Messages", "Notifications",
  "Safety", "Moderation", "Analytics", "Global",
];

export default function LandingV2() {
  return (
    <div className="nexaV2">
      <style>{`
        .nexaV2{--bg:#080909;--panel:#101211;--panel2:#151716;--line:rgba(255,255,255,.11);--muted:#8d938e;--text:#f2f3ef;--accent:#d7c4a0;--accent2:#9db7a9;min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.02em}
        .nexaV2 *{box-sizing:border-box}
        .nexaV2 button{font:inherit;color:inherit}
        .v2nav{height:76px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:20;background:rgba(8,9,9,.84);backdrop-filter:blur(18px)}
        .v2brand{display:flex;align-items:center;gap:12px;font-size:13px;letter-spacing:.18em;font-weight:700}
        .v2mark{width:31px;height:31px;border:1px solid var(--accent);display:grid;place-items:center;color:var(--accent);font-family:Georgia,serif;font-size:16px}
        .v2navlinks{display:flex;gap:28px;color:#aeb3ad;font-size:11px}
        .v2navlinks span{cursor:default}
        .v2navcta{border:1px solid rgba(215,196,160,.55);background:transparent;padding:10px 17px;font-size:10px;letter-spacing:.08em}
        .v2hero{min-height:790px;padding:90px 5vw 70px;display:grid;grid-template-columns:1.02fr .98fr;gap:7vw;align-items:center;position:relative;overflow:hidden}
        .v2glow{position:absolute;width:680px;height:680px;border-radius:50%;right:-230px;top:-160px;background:radial-gradient(circle,rgba(215,196,160,.13),transparent 66%);pointer-events:none}
        .v2eyebrow{font-size:9px;letter-spacing:.24em;color:var(--accent);text-transform:uppercase}
        .v2hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(56px,7vw,104px);line-height:.92;font-weight:400;letter-spacing:-.065em;margin:24px 0 28px;max-width:760px}
        .v2hero h1 em{font-style:italic;color:var(--accent)}
        .v2hero p{max-width:610px;color:#a4aaa4;font-size:15px;line-height:1.9;margin:0}
        .v2actions{display:flex;gap:12px;margin-top:34px;align-items:center}
        .v2primary{background:var(--accent);color:#10100f!important;border:1px solid var(--accent);padding:15px 21px;font-size:10px;font-weight:700;letter-spacing:.08em}
        .v2secondary{background:transparent;border:1px solid var(--line);padding:15px 21px;font-size:10px;color:#c1c6c0}
        .v2proof{display:flex;gap:25px;margin-top:48px;padding-top:20px;border-top:1px solid var(--line);max-width:600px}
        .v2proof div{display:grid;gap:5px}.v2proof b{font-size:11px;letter-spacing:.12em}.v2proof span{font-size:8px;color:#737a74;letter-spacing:.16em}
        .v2product{position:relative;max-width:620px;margin-left:auto;width:100%}
        .v2browser{border:1px solid rgba(255,255,255,.15);background:#0e100f;box-shadow:0 40px 100px rgba(0,0,0,.5);transform:rotate(1.2deg)}
        .v2browserbar{height:42px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 16px;color:#6f756f;font-size:8px;letter-spacing:.14em}
        .v2dots{display:flex;gap:5px}.v2dots i{width:5px;height:5px;border-radius:50%;background:#555}
        .v2productbody{padding:18px;display:grid;grid-template-columns:64px 1fr;min-height:430px}
        .v2side{border-right:1px solid var(--line);display:grid;align-content:start;gap:17px;color:#626862;font-size:8px}
        .v2side b{color:var(--accent);font-weight:400}.v2dash{padding:5px 18px}
        .v2dashhead{display:flex;justify-content:space-between;align-items:end;margin-bottom:18px}.v2dashhead span{font-size:8px;color:#777}.v2dashhead b{font-family:Georgia,serif;font-size:24px;font-weight:400}
        .v2match{display:grid;grid-template-columns:1.05fr .95fr;gap:12px}
        .v2portrait{min-height:260px;background:radial-gradient(circle at 50% 30%,#817865,#242520 48%,#10110f 76%);position:relative;overflow:hidden}
        .v2portrait:before{content:"";position:absolute;width:150px;height:190px;border-radius:48% 48% 42% 42%;background:linear-gradient(135deg,#c7b8a0,#534d42);left:50%;top:55%;transform:translate(-50%,-50%);opacity:.76}
        .v2portrait:after{content:"M";position:absolute;left:50%;top:49%;transform:translate(-50%,-50%);font:italic 90px Georgia,serif;color:rgba(255,255,255,.48)}
        .v2score{position:absolute;right:10px;top:10px;padding:6px 8px;border:1px solid rgba(255,255,255,.2);font-size:8px;color:var(--accent);background:rgba(0,0,0,.28)}
        .v2details{border:1px solid var(--line);padding:16px;display:flex;flex-direction:column;justify-content:space-between}
        .v2details small{font-size:8px;color:#707770;letter-spacing:.12em}.v2details h3{font:400 32px Georgia,serif;margin:8px 0}.v2details p{font-size:9px;color:#858b85;line-height:1.7}
        .v2tags{display:flex;flex-wrap:wrap;gap:5px}.v2tags span{border:1px solid var(--line);padding:6px 7px;font-size:7px;color:#9a9f99}
        .v2matchactions{display:flex;gap:6px;margin-top:10px}.v2matchactions button{flex:1;border:1px solid var(--line);background:transparent;padding:10px;font-size:8px}.v2matchactions .like{background:var(--accent);color:#111;border-color:var(--accent)}
        .v2floating{position:absolute;background:#141716;border:1px solid var(--line);padding:13px 16px;box-shadow:0 20px 50px rgba(0,0,0,.35);font-size:8px}.v2floating b{display:block;color:var(--accent);font-size:16px;margin-bottom:3px}.v2f1{left:-35px;bottom:30px}.v2f2{right:-25px;top:55px}.v2f2 b{color:var(--accent2)}
        .v2section{padding:110px 5vw;border-top:1px solid var(--line)}
        .v2sectionhead{display:flex;justify-content:space-between;gap:40px;margin-bottom:45px}.v2sectionhead h2{font:400 clamp(38px,5vw,66px)/.98 Georgia,serif;letter-spacing:-.055em;margin:12px 0}.v2sectionhead h2 em{color:var(--accent);font-style:italic}.v2sectionhead p{max-width:440px;color:#858b85;font-size:12px;line-height:1.9;align-self:end}
        .v2usegrid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
        .v2use{min-height:205px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:25px;position:relative}.v2use small{color:#686e68;font-size:8px;letter-spacing:.16em}.v2use h3{font:400 25px Georgia,serif;margin:42px 0 7px}.v2use p{font-size:9px;color:#777d77}.v2use b{position:absolute;right:22px;bottom:22px;color:#777;font-size:14px;font-weight:400}
        .v2band{padding:25px 5vw;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;overflow:hidden}.v2band span{font-size:8px;letter-spacing:.18em;color:#747a74;white-space:nowrap}.v2band span:first-child{color:var(--accent)}
        .v2split{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
        .v2split article{background:var(--bg);padding:85px 5vw;min-height:510px}.v2split article:nth-child(2){background:#101211}.v2split .num{font:400 52px Georgia,serif;color:#464b46}.v2split h2{font:400 43px/1.05 Georgia,serif;margin:45px 0 18px}.v2split h2 em{font-style:italic;color:var(--accent)}.v2split p{max-width:470px;color:#838983;font-size:11px;line-height:1.9}.v2list{display:flex;flex-wrap:wrap;gap:7px;margin-top:28px}.v2list span{padding:8px 10px;border:1px solid var(--line);font-size:8px;color:#a1a6a0}
        .v2global{display:grid;grid-template-columns:.8fr 1.2fr;gap:8vw;align-items:center}.v2world{height:390px;position:relative;border:1px solid var(--line);overflow:hidden;background:radial-gradient(circle at 50% 50%,rgba(157,183,169,.09),transparent 58%)}.v2world:before{content:"";position:absolute;width:430px;height:430px;border:1px solid rgba(215,196,160,.16);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}.v2world:after{content:"";position:absolute;width:260px;height:260px;border:1px solid rgba(215,196,160,.13);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%)}.v2globe{position:absolute;width:120px;height:120px;border-radius:50%;border:1px solid rgba(215,196,160,.35);left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;font:italic 34px Georgia,serif;color:var(--accent)}.v2pin{position:absolute;font-size:7px;letter-spacing:.1em;color:#aaa}.v2pin.p1{left:22%;top:28%}.v2pin.p2{right:18%;top:35%}.v2pin.p3{left:29%;bottom:25%}.v2pin.p4{right:24%;bottom:20%}
        .v2capgrid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}.v2cap{padding:22px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);font-size:9px;color:#9ba09a}.v2cap b{display:block;color:var(--accent);font-size:7px;letter-spacing:.16em;margin-bottom:14px;font-weight:400}
        .v2cta{padding:120px 5vw;text-align:center;background:radial-gradient(circle at 50% 40%,rgba(215,196,160,.1),transparent 55%)}.v2cta h2{font:400 clamp(45px,6vw,80px)/.95 Georgia,serif;letter-spacing:-.06em;margin:15px auto 22px;max-width:900px}.v2cta h2 em{color:var(--accent);font-style:italic}.v2cta p{color:#858b85;font-size:12px;max-width:590px;line-height:1.9;margin:0 auto}.v2cta .v2actions{justify-content:center}
        .v2footer{padding:28px 5vw;border-top:1px solid var(--line);display:flex;justify-content:space-between;color:#626862;font-size:8px;letter-spacing:.1em}.v2footer strong{color:#aaa;font-weight:500}
        @media(max-width:900px){.v2hero{grid-template-columns:1fr;padding-top:65px}.v2product{margin:20px auto 0}.v2navlinks{display:none}.v2usegrid{grid-template-columns:1fr 1fr}.v2split,.v2global{grid-template-columns:1fr}.v2capgrid{grid-template-columns:1fr 1fr}.v2sectionhead{display:block}.v2sectionhead p{margin-top:20px}.v2floating{display:none}}
        @media(max-width:580px){.v2nav{padding:0 18px}.v2hero,.v2section{padding-left:18px;padding-right:18px}.v2hero h1{font-size:51px}.v2actions{flex-direction:column;align-items:stretch}.v2proof{gap:13px}.v2productbody{grid-template-columns:1fr}.v2side{display:none}.v2match{grid-template-columns:1fr}.v2portrait{min-height:220px}.v2usegrid,.v2capgrid{grid-template-columns:1fr}.v2split article{padding:60px 18px}.v2world{height:300px}.v2footer{padding:24px 18px;display:grid;gap:12px}}
      `}</style>

      <nav className="v2nav">
        <div className="v2brand"><span className="v2mark">N</span><span>NEXA / UNIVERSAL MATCHING</span></div>
        <div className="v2navlinks"><span>PRODUCT</span><span>USE CASES</span><span>CAPABILITIES</span><span>BUYER</span></div>
        <button className="v2navcta">LIVE DEMO ↗</button>
      </nav>

      <main>
        <section className="v2hero">
          <div className="v2glow" />
          <div>
            <span className="v2eyebrow">COMMERCIAL-READY · UNIVERSAL MATCHING PLATFORM</span>
            <h1>つながりを、<br/><em>あなたのサービスに。</em></h1>
            <p>恋愛、仕事、スキル、趣味、地域、サービス。目的が変わっても使えるマッチング基盤を、最初から作り直さない。購入後はブランドも体験も、あなたの市場に合わせて変えられます。</p>
            <div className="v2actions"><button className="v2primary">製品デモを体験する ↗</button><button className="v2secondary">購入後の自由度を見る</button></div>
            <div className="v2proof"><div><b>WEB</b><span>RESPONSIVE</span></div><div><b>iOS</b><span>READY</span></div><div><b>ANDROID</b><span>READY</span></div><div><b>GLOBAL</b><span>REGION-AWARE</span></div></div>
          </div>
          <div className="v2product">
            <div className="v2browser">
              <div className="v2browserbar"><span>LIVE PRODUCT / MATCHING</span><span className="v2dots"><i/><i/><i/></span></div>
              <div className="v2productbody">
                <aside className="v2side"><b>DISCOVER</b><span>MATCHES</span><span>MESSAGES</span><span>SAFETY</span><span>REGION</span></aside>
                <div className="v2dash">
                  <div className="v2dashhead"><div><span>RECOMMENDED CONNECTION</span><b>Find your next match.</b></div><span>24 ONLINE</span></div>
                  <div className="v2match">
                    <div className="v2portrait"><span className="v2score">96% MATCH</span></div>
                    <div className="v2details"><div><small>CREATIVE · TOKYO</small><h3>Mika</h3><p>目的、興味、地域、背景を組み合わせて、相性の高いつながりを発見。</p></div><div><div className="v2tags"><span>DESIGN</span><span>TRAVEL</span><span>PHOTO</span></div><div className="v2matchactions"><button>SKIP</button><button className="like">LIKE</button></div></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="v2floating v2f1"><b>98%</b><span>matching signal</span></div>
            <div className="v2floating v2f2"><b>SAFE</b><span>privacy by design</span></div>
          </div>
        </section>

        <div className="v2band"><span>ONE PLATFORM / MANY MARKETS</span>{capabilities.map(x=><span key={x}>{x}</span>)}</div>

        <section className="v2section">
          <div className="v2sectionhead"><div><span className="v2eyebrow">01 · UNIVERSAL BY DESIGN</span><h2>「何のマッチング？」を<br/><em>購入者が決める。</em></h2></div><p>ひとつの用途に縛られないことが、この商品の価値。既存のマッチング体験を土台にしながら、購入者が自分の市場・目的・ブランドへ展開できます。</p></div>
          <div className="v2usegrid">{useCases.map(([n,t,d])=><article className="v2use" key={n}><small>{n}</small><h3>{t}</h3><p>{d}</p><b>↗</b></article>)}</div>
        </section>

        <section className="v2split">
          <article><span className="num">01</span><h2>すぐ使う。<br/><em>ブランドだけ変える。</em></h2><p>ロゴ、カラー、画像、文章、言語、地域、プロフィール項目。コードを大きく触らず、購入者自身のサービスとして見せられる導線を用意。</p><div className="v2list"><span>LOGO</span><span>COLOR</span><span>IMAGE</span><span>LANGUAGE</span><span>REGION</span></div></article>
          <article><span className="num">02</span><h2>深く変える。<br/><em>別のサービスにする。</em></h2><p>ソースコードを開いて、マッチングロジック、独自フィールド、API、導線、新機能まで拡張。テンプレートで終わらない販売商品として設計。</p><div className="v2list"><span>LOGIC</span><span>API</span><span>FIELDS</span><span>WORKFLOW</span><span>FEATURES</span></div></article>
        </section>

        <section className="v2section">
          <div className="v2global">
            <div><span className="v2eyebrow">02 · GLOBAL / REGION-AWARE</span><h2 style={{font:"400 clamp(40px,5vw,66px)/1 Georgia,serif",margin:"18px 0"}}>市場が変わっても、<br/><em style={{color:"var(--accent)",fontStyle:"italic"}}>基盤は変えない。</em></h2><p style={{color:"#858b85",fontSize:12,lineHeight:1.9,maxWidth:480}}>国・地域・都市・言語・タイムゾーン・距離・公開範囲。日本向けだけでなく、海外市場へ展開する前提で設計された販売用プラットフォーム。</p></div>
            <div className="v2world"><div className="v2globe">N</div><span className="v2pin p1">JAPAN / JP</span><span className="v2pin p2">EU / EUROPE</span><span className="v2pin p3">US / NORTH AMERICA</span><span className="v2pin p4">SEA / ASIA</span></div>
          </div>
        </section>

        <section className="v2section" style={{paddingTop:80}}>
          <div className="v2sectionhead"><div><span className="v2eyebrow">03 · PLATFORM FOUNDATION</span><h2>見た目だけではなく、<br/><em>サービスの土台まで。</em></h2></div><p>販売時に「これは何が入っているのか」が伝わるよう、主要なプロダクト領域を一つの体験として見せます。</p></div>
          <div className="v2capgrid">{capabilities.map((x,i)=><div className="v2cap" key={x}><b>0{i+1}</b>{x}</div>)}</div>
        </section>

        <section className="v2cta">
          <span className="v2eyebrow">COMMERCIAL DEMO / NEXT STEP</span>
          <h2>完成された基盤から、<br/><em>あなたの市場を始める。</em></h2>
          <p>これは一つのマッチングサービスを売るためのTOPではなく、購入者が自分のサービスを始められることを伝える販売用TOPです。</p>
          <div className="v2actions"><button className="v2primary">実際のデモを体験する ↗</button><button className="v2secondary">仕様・カスタマイズを見る</button></div>
        </section>
      </main>

      <footer className="v2footer"><strong>NEXA / UNIVERSAL MATCHING PLATFORM</strong><span>WEB · iOS · ANDROID · GLOBAL</span><span>COMMERCIAL EDITION · 2026</span></footer>
    </div>
  );
}
