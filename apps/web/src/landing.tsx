import React from 'react';
import { createRoot } from 'react-dom/client';
import './landing.css';
import './landing-polish.css';
import './landing-showcase.css';

const highlights = [
  { number: '01', title: 'One foundation', text: 'Dating, friendship, professional networking, communities, services — one adaptable foundation.' },
  { number: '02', title: 'Trust by design', text: 'Privacy, safety, reporting, moderation, and meaningful interaction are treated as part of the experience.' },
  { number: '03', title: 'Make it yours', text: 'A premium starting point that can be shaped around your brand, market, audience, and region.' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ProductFrame({ type }: { type: 'match' | 'discover' | 'trust' | 'admin' | 'brand' }) {
  if (type === 'match') return <div className="uiFrame"><div className="uiTop"><span>MONO / MATCH</span><span className="uiDots"><i /><i /><i /></span></div><div className="matchInterface"><div className="profilePanel"><div className="profileMeta"><strong>Amelia, 29</strong><small>Lisbon · Design · Travel</small></div></div><div className="matchReason"><strong>WHY THIS CONNECTION</strong><div className="matchScore">98%</div><div className="reasonRow"><span>Shared interests</span><b>High</b></div><div className="reasonRow"><span>Goals</span><b>Aligned</b></div><div className="reasonRow"><span>Location</span><b>Nearby</b></div></div></div></div>;
  if (type === 'discover') return <div className="uiFrame"><div className="uiTop"><span>DISCOVER / FOR YOU</span><span>GLOBAL</span></div><div className="discoveryUI"><div className="discoveryHeader"><strong>People worth meeting</strong><span className="filterPill">FILTERS +</span></div><div className="discoveryGrid">{['Noah, 31','Mina, 28','Leo, 34'].map((name) => <div className="discoverCard" key={name}><div className="discoverInfo"><strong>{name}</strong><small>Goals · Interests · Local context</small></div></div>)}</div></div></div>;
  if (type === 'trust') return <div className="uiFrame"><div className="uiTop"><span>TRUST / SAFETY</span><span>PROTECTED</span></div><div className="trustUI"><div className="trustCard"><div className="trustIcon">◎</div><strong>Privacy by design</strong><p>Clear visibility controls and thoughtful handling of personal context.</p></div><div className="trustCard"><div className="trustIcon">⌁</div><strong>Safety controls</strong><p>Report, block, moderation and review states are part of the experience.</p></div><div className="trustCard"><div className="trustIcon">◌</div><strong>Human signals</strong><p>Trust is communicated through calm, understandable product states.</p></div><div className="trustCard"><div className="trustIcon">+</div><strong>Responsible growth</strong><p>A system designed to scale without making people feel like data points.</p></div></div></div>;
  if (type === 'admin') return <div className="uiFrame"><div className="uiTop"><span>MONO / CONTROL</span><span>LIVE OVERVIEW</span></div><div className="adminUI"><div className="adminStats"><div className="adminStat"><small>ACTIVE USERS</small><strong>24.8K</strong></div><div className="adminStat"><small>MATCH RATE</small><strong>86%</strong></div><div className="adminStat"><small>TRUST CASES</small><strong>142</strong></div></div><div className="adminGraph" /></div></div>;
  return <div className="uiFrame"><div className="uiTop"><span>BRAND / CONFIGURE</span><span>PREVIEW</span></div><div className="brandUI"><div className="brandPreview"><div className="brandLogo">Your brand.</div><h4>Connection,<br /><em>reimagined.</em></h4><p>One foundation, shaped around your audience and market.</p></div><div className="brandSettings"><small>QUICK LAUNCH</small><div className="settingLine"><span>Logo</span><span>Changed</span></div><div className="settingLine"><span>Colors</span><span>Warm / Dark</span></div><div className="settingLine"><span>Region</span><span>Portugal</span></div><div className="settingLine"><span>Language</span><span>English</span></div></div></div></div>;
}

function LandingPage() {
  return (
    <div className="landing">
      <header className="landingNav">
        <button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><span className="brandSymbol">M</span><span>MONO</span></button>
        <nav aria-label="Preview navigation">
          <button type="button" onClick={() => scrollToSection('experience')}>Experience</button>
          <button type="button" onClick={() => scrollToSection('safety')}>Safety</button>
          <button type="button" onClick={() => scrollToSection('global')}>Global</button>
        </nav>
        <button className="navButton" type="button" onClick={() => scrollToSection('contact')}>Explore</button>
      </header>

      <main>
        <section className="heroLanding" id="top">
          <div className="heroOrb heroOrbOne" /><div className="heroOrb heroOrbTwo" />
          <div className="heroCopy">
            <p className="overline">THE UNIVERSAL MATCHING PLATFORM</p>
            <h1>Where the right<br /><em>connections</em> begin.</h1>
            <p className="heroLead">A sophisticated matching system built to adapt across people, purposes, and markets — with the product depth to become your next service.</p>
            <div className="heroActions"><button className="primaryButton" type="button" onClick={() => scrollToSection('experience')}>Discover the experience <span>↗</span></button><span className="heroNote">A premium foundation for your next service</span></div>
          </div>
          <div className="heroVisual" aria-hidden="true"><div className="portrait portraitBack"><div className="portraitFigure" /><span className="portraitInitial">Y</span></div><div className="portrait portraitMain"><div className="portraitFigure" /><span className="portraitInitial">A</span></div><div className="matchBadge"><span className="matchDot" /><div><strong>98% match</strong><small>Connection found</small></div></div><div className="locationBadge"><span>◎</span> Anywhere in the world</div></div>
          <button className="heroBottom" type="button" onClick={() => scrollToSection('experience')}><span>SCROLL TO EXPLORE</span><span className="scrollLine" /></button>
        </section>

        <section className="introLanding" id="global"><p className="overline">ONE FOUNDATION / MANY POSSIBILITIES</p><div className="introGrid"><h2>Not another<br /><em>single-purpose</em> app.</h2><p>Build a dating service, a friendship community, a professional network, a local marketplace, or a completely new idea. The experience starts with one elegant foundation and becomes distinctly yours.</p></div></section>

        <section className="productStory" id="experience">
          <div className="storyIntro"><span className="storyKicker">01 / PRODUCT, NOT PROMISES</span><div><h2>See the system<br />behind the <em>connection.</em></h2><p>Instead of describing a list of features, the experience reveals the product itself — matching, discovery, trust, operations, and customization working as one considered system.</p></div></div>
          <div className="productStage"><div className="stageCopy"><span className="stageIndex">02 / MATCHING INTELLIGENCE</span><h3>Every connection has a <em>reason.</em></h3><p>A matching experience can surface compatibility, shared interests, goals, and local context without turning the interface into a spreadsheet.</p><div className="stageTags"><span>Compatibility</span><span>Goals</span><span>Interests</span><span>Location</span></div></div><ProductFrame type="match" /></div>
          <div className="productStage reverse"><ProductFrame type="discover" /><div className="stageCopy"><span className="stageIndex">03 / DISCOVERY</span><h3>More context.<br /><em>Better choices.</em></h3><p>Discovery is designed around people and purpose, not an endless stack of identical cards. The same foundation can serve very different markets.</p><div className="stageTags"><span>Dating</span><span>Friendship</span><span>Networking</span><span>Communities</span></div></div></div>
          <div className="productStage" id="safety"><div className="stageCopy"><span className="stageIndex">04 / TRUST & SAFETY</span><h3>Confidence is part of the <em>interface.</em></h3><p>Privacy, safety, reporting, blocking, and moderation are presented as first-class product experiences rather than hidden afterthoughts.</p></div><ProductFrame type="trust" /></div>
          <div className="productStage reverse"><ProductFrame type="admin" /><div className="stageCopy"><span className="stageIndex">05 / OPERATIONS</span><h3>A serious product needs a <em>serious control layer.</em></h3><p>Behind the elegant consumer experience sits a visual language for administration, moderation, analytics, and operational decisions.</p></div></div>
          <div className="productStage"><div className="stageCopy"><span className="stageIndex">06 / YOUR BRAND</span><h3>One system.<br /><em>Your identity.</em></h3><p>Show buyers the transformation: the same foundation can become a distinct service through branding, language, region, and configuration.</p></div><ProductFrame type="brand" /></div>
        </section>

        <section className="highlightLanding">{highlights.map((item) => <article key={item.number} className="highlightCard"><span className="highlightNumber">{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="cardArrow">↗</span></article>)}</section>
        <section className="statementLanding"><div className="statementMark">M</div><p className="overline">DESIGNED TO FEEL PREMIUM</p><h2>Beautiful enough<br />to <em>belong.</em></h2><p className="statementText">Quiet confidence. Clear decisions. Human moments. A platform designed to make connection feel considered rather than crowded.</p></section>
        <section className="ctaLanding" id="contact"><p className="overline">A NEW STARTING POINT</p><h2>Start with a<br /><em>better foundation.</em></h2><button className="primaryButton light" type="button" onClick={() => scrollToSection('experience')}>Discover what’s possible <span>↗</span></button></section>
      </main>

      <footer className="landingFooter"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">M</span><span>MONO</span></button><span>Universal matching platform</span><span>© 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);
