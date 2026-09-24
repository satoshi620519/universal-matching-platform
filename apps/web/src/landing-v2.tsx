import React from "react";
import { createRoot } from "react-dom/client";

const useCases = [
  ["01", "恋愛", "価値観・距離・目的"],
  ["02", "ビジネス", "採用・提携・人脈"],
  ["03", "スキル", "専門家・相談・依頼"],
  ["04", "コミュニティ", "地域・趣味・イベント"],
  ["05", "サービス", "事業者・利用者"],
  ["06", "あなたの市場", "ルールを自由に設計"],
];

const capabilities = ["Matching", "Profiles", "Messages", "Notifications", "Safety", "Moderation", "Analytics", "Global"];

function LandingV2() {
  return (
    <div style={{minHeight:"100vh",background:"#080909",color:"#f2f3ef",fontFamily:"Inter,system-ui,sans-serif"}}>
      <style>{`
        *{box-sizing:border-box}body{margin:0}.n{max-width:1280px;margin:auto;padding:0 5vw}.nav{height:76px;border-bottom:1px solid #252725;display:flex;align-items:center;justify-content:space-between}.brand{letter-spacing:.16em;font-size:12px;font-weight:700}.mark{display:inline-grid;place-items:center;width:32px;height:32px;border:1px solid #d7c4a0;color:#d7c4a0;margin-right:12px;font:16px Georgia}.hero{min-height:720px;display:grid;grid-template-columns:1fr 1fr;gap:7vw;align-items:center;padding-top:70px;padding-bottom:70px}.ey{font-size:9px;letter-spacing:.2em;color:#d7c4a0}.hero h1{font:400 clamp(54px,7vw,100px)/.92 Georgia;margin:22px 0;letter-spacing:-.06em}.hero em,h2 em{color:#d7c4a0}.hero p,.section p{color:#929892;line-height:1.9;font-size:13px}.actions{display:flex;gap:10px;margin-top:28px}.primary,.secondary{padding:14px 20px;font-size:10px;border:1px solid #d7c4a0}.primary{background:#d7c4a0;color:#111}.secondary{background:transparent;color:#ddd;border-color:#383b38}.mock{border:1px solid #333;background:#101211;box-shadow:0 35px 80px #0008;transform:rotate(1deg)}.bar{padding:14px;border-bottom:1px solid #292c29;color:#707770;font-size:8px}.mockbody{padding:24px;min-height:390px}.card{display:grid;grid-template-columns:1fr 1fr;gap:12px}.portrait{min-height:280px;background:radial-gradient(circle at 50% 30%,#857b6c,#252620 50%,#10110f)}.details{border:1px solid #292c29;padding:20px;display:flex;flex-direction:column;justify-content:space-between}.details h3{font:400 34px Georgia;margin:10px 0}.tag{display:inline-block;border:1px solid #333;padding:7px;margin:3px;font-size:8px;color:#999}.proof{display:flex;gap:28px;margin-top:40px;padding-top:18px;border-top:1px solid #292c29;font-size:10px;color:#888}.band{border-block:1px solid #292c29;padding:20px 5vw;display:flex;justify-content:space-between;gap:15px;overflow:auto;color:#777;font-size:8px;letter-spacing:.12em}.section{padding:100px 0;border-bottom:1px solid #292c29}.section h2{font:400 clamp(38px,5vw,65px)/1 Georgia;margin:15px 0 35px}.grid{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #292c29}.cell{min-height:180px;padding:24px;border-right:1px solid #292c29;border-bottom:1px solid #292c29}.cell small{color:#666}.cell h3{font:400 25px Georgia;margin-top:55px}.split{display:grid;grid-template-columns:1fr 1fr}.split>div{padding:80px 5vw;border-right:1px solid #292c29;border-bottom:1px solid #292c29}.num{font:52px Georgia;color:#444}.caps{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #292c29}.cap{padding:24px;border-right:1px solid #292c29;border-bottom:1px solid #292c29;color:#aaa}.cta{text-align:center;padding:120px 5vw}.footer{border-top:1px solid #292c29;padding:28px 5vw;color:#666;font-size:8px;display:flex;justify-content:space-between}@media(max-width:850px){.hero,.split{grid-template-columns:1fr}.grid{grid-template-columns:1fr 1fr}.caps{grid-template-columns:1fr 1fr}.footer{display:block;line-height:2}}@media(max-width:560px){.hero{padding-top:45px}.grid,.caps{grid-template-columns:1fr}.card{grid-template-columns:1fr}.actions{flex-direction:column}.hero h1{font-size:52px}}
      `}</style>
      <nav className="nav n"><div className="brand"><span className="mark">N</span>NEXA / UNIVERSAL MATCHING</div><button className="secondary">LIVE DEMO ↗</button></nav>
      <main>
        <section className="hero n"><div><span className="ey">COMMERCIAL-READY · UNIVERSAL MATCHING PLATFORM</span><h1>つながりを、<br/><em>あなたのサービスに。</em></h1><p>恋愛、仕事、スキル、趣味、地域、サービス。目的が変わっても使えるマッチング基盤を、最初から作り直さない。購入後はブランドも体験も、あなたの市場に合わせて変えられます。</p><div className="actions"><button className="primary">製品デモを体験する ↗</button><button className="secondary">購入後の自由度を見る</button></div><div className="proof"><b>WEB</b><b>iOS</b><b>ANDROID</b><b>GLOBAL</b></div></div><div className="mock"><div className="bar">LIVE PRODUCT / MATCHING</div><div className="mockbody"><div className="card"><div className="portrait"></div><div className="details"><div><small>CREATIVE · TOKYO</small><h3>Mika</h3><p>目的、興味、地域、背景を組み合わせて、相性の高いつながりを発見。</p></div><div><span className="tag">DESIGN</span><span className="tag">TRAVEL</span><span className="tag">PHOTO</span><div className="actions"><button className="secondary">SKIP</button><button className="primary">LIKE</button></div></div></div></div></div></div></section>
        <div className="band">{capabilities.map(x=><span key={x}>{x}</span>)}</div>
        <section className="section n"><span className="ey">01 · UNIVERSAL BY DESIGN</span><h2>「何のマッチング？」を<br/><em>購入者が決める。</em></h2><p>ひとつの用途に縛られないことが、この商品の価値。購入者が自分の市場・目的・ブランドへ展開できます。</p><div className="grid">{useCases.map(([a,b,c])=><div className="cell" key={a}><small>{a}</small><h3>{b}</h3><p>{c}</p></div>)}</div></section>
        <section className="split"><div><span className="num">01</span><h2>すぐ使う。<br/><em>ブランドだけ変える。</em></h2><p>ロゴ、カラー、画像、文章、言語、地域、プロフィール項目を購入者のサービスに合わせられます。</p></div><div><span className="num">02</span><h2>深く変える。<br/><em>別のサービスにする。</em></h2><p>ソースコードを開いて、マッチングロジック、独自フィールド、API、導線、新機能まで拡張できます。</p></div></section>
        <section className="section n"><span className="ey">02 · GLOBAL / REGION-AWARE</span><h2>市場が変わっても、<br/><em>基盤は変えない。</em></h2><p>国・地域・都市・言語・タイムゾーン・距離・公開範囲。海外市場への展開を前提にした販売用プラットフォーム。</p></section>
        <section className="section n"><span className="ey">03 · PLATFORM FOUNDATION</span><h2>見た目だけではなく、<br/><em>サービスの土台まで。</em></h2><div className="caps">{capabilities.map((x,i)=><div className="cap" key={x}><small>0{i+1}</small><br/><br/>{x}</div>)}</div></section>
        <section className="cta"><span className="ey">COMMERCIAL DEMO / NEXT STEP</span><h2>完成された基盤から、<br/><em>あなたの市場を始める。</em></h2><p>一つのマッチングサービスではなく、購入者が自分のサービスを始められる販売用プラットフォームです。</p><div className="actions" style={{justifyContent:"center"}}><button className="primary">実際のデモを体験する ↗</button><button className="secondary">仕様・カスタマイズを見る</button></div></section>
      </main><footer className="footer"><strong>NEXA / UNIVERSAL MATCHING PLATFORM</strong><span>WEB · iOS · ANDROID · GLOBAL</span><span>COMMERCIAL EDITION · 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<LandingV2 />);
