import React from 'react';
import { createRoot } from 'react-dom/client';
import './landing.css';
import './landing-polish.css';
import './landing-showcase.css';
import './landing-sales.css';
import './landing-finish.css';
import './landing-final.css';

const useCases = [
  ['01', 'Dating', 'Intent-led discovery for people looking for meaningful relationships.'],
  ['02', 'Friendship', 'A calmer way to meet people around shared interests and life stages.'],
  ['03', 'Business', 'Professional networking, partnerships, recruiting, and introductions.'],
  ['04', 'Mentorship', 'Connect people by goals, expertise, experience, and availability.'],
  ['05', 'Community', 'Build focused communities around places, interests, events, or causes.'],
  ['06', 'Services', 'Match customers with specialists, creators, freelancers, or local providers.'],
];

const featureGroups = [
  ['01', 'Match & discover', 'Matching engine, configurable scoring, recommendations, search, filters, sorting, cards, lists, grids, likes, interests and mutual matches.'],
  ['02', 'Profiles & identity', 'Avatars, galleries, bios, structured fields, custom fields, verification states, profile completion and privacy visibility.'],
  ['03', 'Messages & notifications', 'Conversations, real-time messaging architecture, read states, typing, media, in-app notifications, email and push-ready flows.'],
  ['04', 'Trust & safety', 'Block, report, evidence capture, moderation queues, warnings, suspension, bans, audit trails, rate limits and spam controls.'],
  ['05', 'Admin & analytics', 'Users, profiles, reports, moderation, configuration, feature flags, localization, system health and product analytics.'],
  ['06', 'Global & localization', 'Countries, regions, cities, languages, locales, time zones, distance matching and privacy-aware location precision.'],
  ['07', 'Payments & extensibility', 'Optional paid features, payment integrations, API conventions, versioning, webhooks and extension-ready architecture.'],
  ['08', 'Web / iOS / Android', 'Responsive web plus native-quality mobile product structure, sharing the same product philosophy and configurable foundation.'],
];

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function MiniProduct() {
  return <div className="salesProduct">
    <div className="salesProductBar"><span>NEXA / MATCHING</span><span>LIVE PREVIEW</span></div>
    <div className="salesProductMain">
      <div className="salesProfileVisual"><div className="orbit orbitA"/><div className="orbit orbitB"/><div className="person personOne">A</div><div className="person personTwo">M</div><div className="person personThree">L</div><span className="visualLabel">PEOPLE / PURPOSE / PLACE</span></div>
      <div className="salesProductInfo"><span className="micro">YOUR NEXT CONNECTION</span><h3>98%<em> compatible</em></h3><p>Shared interests<br/>Goals · Context · Intent</p><div className="signal"><i/><i/><i/><i/><i/></div><button type="button" onClick={() => scrollTo('features')}>Explore the system <b>↗</b></button></div>
    </div>
    <div className="salesProductFoot"><span>Private by design</span><span>Configurable rules</span><span>Built for your market</span></div>
  </div>;
}

function LandingPage() {
  return <div className="landing salesLanding">
    <header className="landingNav salesNav">
      <button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button>
      <nav aria-label="Landing navigation"><button type="button" onClick={() => scrollTo('usecases')}>Use cases</button><button type="button" onClick={() => scrollTo('features')}>Features</button><button type="button" onClick={() => scrollTo('customize')}>Customize</button><button type="button" onClick={() => scrollTo('safety')}>Safety</button></nav>
      <button className="navButton" type="button" onClick={() => scrollTo('launch')}>See the platform</button>
    </header>

    <main>
      <section className="salesHero" id="top">
        <div className="heroAmbient"/><div className="heroRings"/>
        <div className="salesHeroCopy"><span className="salesEyebrow"><i/> UNIVERSAL MATCHING PLATFORM</span><h1>One foundation.<br/><em>Your</em> matching service.</h1><p>Launch a polished matching product as-is, or reshape the brand, rules, audience and experience until it becomes unmistakably yours.</p><div className="salesHeroActions"><button className="salesPrimary" type="button" onClick={() => scrollTo('usecases')}>See what you can build <span>↗</span></button><button className="salesTextButton" type="button" onClick={() => scrollTo('customize')}>As-is or fully customized <span>↓</span></button></div><div className="heroTrust"><span>WEB</span><span>iOS</span><span>ANDROID</span><span>GLOBAL</span></div></div>
        <div className="salesHeroVisual"><MiniProduct/><div className="floatingStat"><strong>6+</strong><span>matching models</span></div><div className="floatingStat second"><strong>100%</strong><span>brand-ready</span></div></div>
        <button className="heroScroll" type="button" onClick={() => scrollTo('intro')}>SCROLL TO DISCOVER <i/></button>
      </section>

      <section className="salesIntro" id="intro"><div className="salesSectionTop"><span>01 / THE IDEA</span><span>NOT A SINGLE-PURPOSE APP</span></div><div className="introHeadline"><h2>Don't start from<br/><em>zero.</em></h2><div><p>This is a premium foundation for building services that connect people for a purpose. The product already has the visual language, product structure and operational thinking — so a buyer can focus on their market instead of rebuilding the basics.</p><button type="button" onClick={() => scrollTo('features')}>What is included <span>↘</span></button></div></div><div className="introManifest"><span>01</span><b>CHOOSE THE PURPOSE</b><span>→</span><b>SHAPE THE EXPERIENCE</b><span>→</span><b>MAKE IT YOURS</b></div></section>

      <section className="useCaseSection" id="usecases"><div className="sectionHeading"><div><span className="salesEyebrow">02 / ONE CORE · MANY MARKETS</span><h2>What will you<br/><em>connect?</em></h2></div><p>The same foundation can become a dating service, a professional network, a local community, a mentorship product, or a completely new niche. The buyer decides the purpose.</p></div><div className="useCaseGrid">{useCases.map(([n,t,d]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b>↗</b></article>)}</div></section>

      <section className="featureSection" id="features"><div className="featureIntro"><span className="salesEyebrow">03 / THE PLATFORM</span><h2>Everything buyers<br/><em>need to see.</em></h2><p>Not a vague promise. The sales experience makes the scope visible: product, safety, operations, global readiness and the foundations needed to customize it.</p></div><div className="featureList">{featureGroups.map(([n,t,d]) => <article key={n}><span className="featureNo">{n}</span><div><h3>{t}</h3><p>{d}</p></div><span className="featurePlus">+</span></article>)}</div></section>

      <section className="customSection" id="customize"><div className="customHeader"><span className="salesEyebrow">04 / MAKE IT YOURS</span><h2>Use it now.<br/><em>Own the direction.</em></h2></div><div className="customSplit"><article className="customCard ready"><span className="cardKicker">QUICK LAUNCH</span><div className="cardNumber">01</div><h3>Keep the design.<br/>Change the <em>identity.</em></h3><p>For buyers who want to launch quickly. Replace the logo, colors, imagery, language, terminology and legal/support links — then publish.</p><div className="customItems"><span>Logo & colors</span><span>Images & typography</span><span>Languages & regions</span><span>Profile questions</span></div></article><article className="customCard developer"><span className="cardKicker">ADVANCED CUSTOMIZATION</span><div className="cardNumber">02</div><h3>Change the rules.<br/>Make it <em>different.</em></h3><p>For buyers with a product team. Source code stays open to customization: matching logic, profile fields, onboarding, integrations, APIs and new features.</p><div className="customItems"><span>Matching algorithms</span><span>Feature visibility</span><span>API & webhooks</span><span>New product logic</span></div></article></div><div className="customBottom"><span>THE RESULT</span><strong>It can look like the product you bought — or like a product you built yourself.</strong></div></section>

      <section className="safetySection" id="safety"><div className="safetyVisual"><div className="shieldCore">N</div><div className="safetyOrbit o1"/><div className="safetyOrbit o2"/><div className="safetyBadge">TRUST / BUILT IN</div></div><div className="safetyCopy"><span className="salesEyebrow">05 / TRUST & SAFETY</span><h2>Premium means<br/><em>responsible.</em></h2><p>Privacy and safety are part of the product story, not an afterthought. Buyers can present a service that feels considered from the first interaction to moderation and administration.</p><div className="safetyPoints"><span>Privacy controls</span><span>Report & block</span><span>Moderation queue</span><span>Audit logs</span><span>Abuse prevention</span><span>Location privacy</span></div></div></section>

      <section className="globalSection"><div><span className="salesEyebrow">06 / GLOBAL BY DESIGN</span><h2>Local enough<br/>for <em>any market.</em></h2></div><div className="globalMap"><div className="mapLines"/><span className="mapPin p1">JP</span><span className="mapPin p2">EU</span><span className="mapPin p3">US</span><span className="mapPin p4">SEA</span><div className="mapCaption"><b>REGION AWARE</b><span>Country · Region · City · Language · Timezone</span></div></div></section>

      <section className="launchSection" id="launch"><div className="launchInner"><span className="salesEyebrow">07 / YOUR NEXT PRODUCT</span><h2>Buy the foundation.<br/><em>Build the connection.</em></h2><p>A polished starting point for a serious matching business — ready to use, ready to customize, ready to become yours.</p><div className="launchActions"><button className="salesPrimary dark" type="button" onClick={() => scrollTo('features')}>Explore all features <span>↗</span></button><button className="salesTextButton darkText" type="button" onClick={() => scrollTo('top')}>Back to top ↑</button></div></div></section>
    </main>
    <footer className="landingFooter salesFooter"><button className="landingBrand landingBrandButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span className="brandSymbol">N</span><span>NEXA</span></button><span>Universal matching platform · Web · iOS · Android</span><span>© 2026</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);
