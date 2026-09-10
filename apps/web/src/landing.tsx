import React from 'react';
import { createRoot } from 'react-dom/client';
import './landing.css';
import './landing-polish.css';
import './landing-showcase.css';

const highlights = [
  { number: '01', title: 'One adaptable core', text: 'Dating, friendship, networking, communities, services — the same premium foundation can become a different product.' },
  { number: '02', title: 'Trust is visible', text: 'Privacy, safety, reporting, moderation, and meaningful interaction belong in the experience from the beginning.' },
  { number: '03', title: 'Ready for your brand', text: 'Shape the identity, market, language, region, and experience without rebuilding the product from zero.' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ProductFrame({ type }: { type: 'match' | 'discover' | 'trust' | 'admin' | 'brand' }) {
  if (type === 'match') return <div className="uiFrame"><div className="uiTop"><span>01 / MATCHING</span><span>LIVE</span></div><div className="matchInterface"><div className="profilePanel"><div className="profilePhoto"><span>A</span></div><div className="profileMeta"><strong>Amelia, 29</strong><small>Lisbon · Design · Travel</small></div><div className="profileActions"><button type="button">×</button><button type="button">♡</button></div></div><div className="matchReason"><strong>WHY THIS CONNECTION</strong><div className="matchScore">98%</div><div className="reasonRow"><span>Shared interests</span><b>High</b></div><div className="reasonRow"><span>Goals</span><b>Aligned</b></div><div className="reasonRow"><span>Local context</span><b>Strong</b></div></div></div></div>;
  if (type === 'discover') return <div className="uiFrame"><div className="uiTop"><span>02 / DISCOVER</span><span>GLOBAL</span></div><div className="discoveryUI"><div className="discoveryHeader"><div><small>CURATED FOR YOU</small><strong>People worth meeting</strong></div><span className="filterPill">FILTERS +</span></div><div className="discoveryGrid">{['Noah, 31','Mina, 28','Leo, 34'].map((name, index) => <div className={`discoverCard discoverCard${index + 1}`} key={name}><span className="discoverAvatar">{name[0]}</span><div className="discoverInfo"><strong>{name}</strong><small>{index === 0 ? 'Product · Running' : index === 1 ? 'Art · Travel' : 'Business · Music'}</small></div><span className="discoverArrow">↗</span></div>)}</div></div></div>;
  if (type === 'trust') return <div className="uiFrame"><div className="uiTop"><span>03 / TRUST</span><span>PROTECTED</span></div><div className="trustUI"><div className="trustHeader"><span>SAFETY CENTER</span><b>ALL SYSTEMS CLEAR</b></div><div className="trustGrid"><div className="trustCard"><div className="trustIcon">◈</div><strong>Privacy controls</strong><p>Clear visibility settings.</p></div><div className="trustCard"><div className="trustIcon">⌁</div><strong>Safety tools</strong><p>Report, block, review.</p></div><div className="trustCard"><div className="trustIcon">◌</div><strong>Human signals</strong><p>Calm, understandable states.</p></div><div className="trustCard"><div className="trustIcon">+</div><strong>Responsible growth</strong><p>Built to scale with care.</p></div></div></div></div>;
  if (type === 'admin') return <div className="uiFrame"><div className="uiTop"><span>04 / CONTROL</span><span>LIVE OVERVIEW</span></div><div className="adminUI"><div className="adminStats"><div className="adminStat"><small>ACTIVE USERS</small><strong>24.8K</strong><span>+12.4%</span></div><div className="adminStat"><small>MATCH RATE</small><strong>86%</strong><span>+4.8%</span></div><div className="adminStat"><small>TRUST CASES</small><strong>142</strong><span>−8.2%</span></div></div><div className="adminGraph"><span className="graphLabel">ACTIVITY / 30 DAYS</span><i /><i /><i /><i /><i /><i /><i /></div></div></div>;
  return <div className="uiFrame"><div className="uiTop"><span>05 / CONFIGURE</span><span>PREVIEW</span></div><div className="brandUI"><div className="brandPreview"><span className="brandPreviewKicker">YOUR SERVICE</span><div className="brandLogo">Your brand.</div><h4>Connection,<br /><em>reimagined.</em></h4><p>One foundation, shaped around your audience.</p></div><div className="brandSettings"><small>QUICK LAUNCH</small><div className="settingLine"><span>Identity</span><span>Ready</span></div><div className="settingLine"><span>Region</span><span>Global</span></div><div className="settingLine"><span>Language</span><span>English +</span></div><div className="settingLine"><span>Experience</span><span>Flexible</span></div></div></div></div>;
}

function LandingPage() {
  return (
    <div className="landing">
      <header className="landingNav">
        <button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><span className="brandSymbol">N</span><span>NEXA</span></button>
        <nav aria-label="Preview navigation"><button type="button" onClick={() => scrollToSection('experience')}>Experience</button><button type="button" onClick={() => scrollToSection('safety')}>Safety</button><button type="button" onClick={() => scrollToSection('global')}>Global</button></nav>
        <button className="navButton" type="button" onClick={() => scrollToSection('contact')}>Explore</button>
      </header>

      <main>
        <section className="heroLanding" id="top">
          <div className="heroGridGlow" />
          <div className="heroCopy"><p className="overline">THE UNIVERSAL MATCHING PLATFORM</p><h1>Build a service<br />people <em>choose.</em></h1><p className="heroLead">A premium matching foundation for dating, friendship, networking, communities, and entirely new ways to connect — designed to become your product.</p><div className="heroActions"><button className="primaryButton" type="button" onClick={() => scrollToSection('experience')}>Explore the experience <span>↗</span></button><span className="heroNote">One foundation<br />Many possibilities</span></div></div>
          <div className="heroVisual" aria-hidden="true"><div className="heroInterface"><div className="heroInterfaceTop"><span>NEXA / DISCOVER</span><span>GLOBAL · FOR YOU</span></div><div className="heroInterfaceBody"><div className="heroPeople"><div className="heroPerson heroPersonA"><span>A</span></div><div className="heroPerson heroPersonB"><span>M</span></div><div className="heroPerson heroPersonC"><span>L</span></div></div><div className="heroInterfaceCopy"><small>YOUR NEXT CONNECTION</small><strong>98% compatible</strong><p>Shared interests · Goals · Context</p><div className="heroMeter"><i /></div></div></div><div className="heroInterfaceFooter"><span>Thoughtful matching</span><span>Private by design</span><span>Made for your market</span></div></div><div className="heroFloating heroFloatingOne"><span>◎</span> Anywhere</div><div className="heroFloating heroFloatingTwo"><b>98%</b><span>match</span></div></div>
          <button className="heroBottom" type="button" onClick={() => scrollToSection('experience')}><span>SCROLL TO EXPLORE</span><span className="scrollLine" /></button>
        </section>

        <section className="introLanding" id="global"><div className="sectionNumber">01</div><p className="overline">ONE FOUNDATION / MANY POSSIBILITIES</p><div className="introGrid"><h2>Not another<br /><em>single-purpose</em> app.</h2><div><p>Start with a sophisticated system instead of a blank canvas. Whether the destination is dating, friendship, professional networking, local discovery, or something entirely new, the foundation stays elegant and adaptable.</p><span className="introRule">DESIGNED TO BE REBRANDED · RESHAPED · REDEPLOYED</span></div></div></section>

        <section className="productStory" id="experience"><div className="storyIntro"><span className="storyKicker">02 / THE PRODUCT</span><div><h2>See what your<br />service could <em>be.</em></h2><p>The landing experience should sell the product without pretending to be the product. These interface moments show buyers the visual language they are starting with.</p></div></div>
          <div className="productStage"><div className="stageCopy"><span className="stageIndex">01 / MATCHING INTELLIGENCE</span><h3>Every connection has a <em>reason.</em></h3><p>Compatibility, shared interests, goals, and local context become understandable signals instead of a mysterious score.</p><div className="stageTags"><span>Compatibility</span><span>Goals</span><span>Interests</span><span>Context</span></div></div><ProductFrame type="match" /></div>
          <div className="productStage reverse"><ProductFrame type="discover" /><div className="stageCopy"><span className="stageIndex">02 / DISCOVERY</span><h3>More context.<br /><em>Better choices.</em></h3><p>Discovery feels curated and human. The same visual foundation can be adapted for completely different audiences and purposes.</p><div className="stageTags"><span>Dating</span><span>Friendship</span><span>Networking</span><span>Communities</span></div></div></div>
          <div className="productStage" id="safety"><div className="stageCopy"><span className="stageIndex">03 / TRUST & SAFETY</span><h3>Confidence belongs in the <em>interface.</em></h3><p>Privacy, safety, reporting, blocking, and moderation are designed as visible product experiences rather than buried settings.</p><div className="stageTags"><span>Privacy</span><span>Safety</span><span>Moderation</span></div></div><ProductFrame type="trust" /></div>
          <div className="productStage reverse"><ProductFrame type="admin" /><div className="stageCopy"><span className="stageIndex">04 / OPERATIONS</span><h3>A serious service needs a <em>control layer.</em></h3><p>Behind the consumer experience sits a clear visual system for operations, analytics, moderation, and the decisions that keep a service healthy.</p><div className="stageTags"><span>Analytics</span><span>Moderation</span><span>Operations</span></div></div></div>
          <div className="productStage"><div className="stageCopy"><span className="stageIndex">05 / YOUR BRAND</span><h3>One system.<br /><em>Your identity.</em></h3><p>Change the identity without losing the quality. Branding, language, region, and experience can become distinctly yours.</p><div className="stageTags"><span>Brand</span><span>Language</span><span>Region</span></div></div><ProductFrame type="brand" /></div>
        </section>

        <section className="highlightLanding"><div className="highlightHeader"><p className="overline">03 / WHY THIS FOUNDATION</p><h2>Built to become<br /><em>something else.</em></h2></div>{highlights.map((item) => <article key={item.number} className="highlightCard"><span className="highlightNumber">{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="cardArrow">↗</span></article>)}</section>
        <section className="statementLanding"><div className="statementMark">N</div><p className="overline">DESIGNED TO FEEL PREMIUM</p><h2>Beautiful enough<br />to <em>belong.</em></h2><p className="statementText">Quiet confidence. Clear decisions. Human moments. A visual system designed to make connection feel considered rather than crowded.</p></section>
        <section className="ctaLanding" id="contact"><p className="overline">04 / YOUR NEXT PRODUCT</p><h2>Start with a<br /><em>better foundation.</em></h2><p>Turn the visual language into a service that feels like it was made for your market.</p><button className="primaryButton light" type="button" onClick={() => scrollToSection('experience')}>Explore the system <span>↗</span></button></section>
      </main>

      <footer className="landingFooter"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button><span>Universal matching platform</span><span>© 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);
