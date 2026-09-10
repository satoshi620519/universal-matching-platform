import React from 'react';
import { createRoot } from 'react-dom/client';
import './landing.css';
import './landing-polish.css';

const highlights = [
  { number: '01', title: 'One foundation', text: 'Dating, friendship, professional networking, communities, services — one adaptable foundation.' },
  { number: '02', title: 'Trust by design', text: 'A refined experience where privacy, safety, and meaningful interaction come first.' },
  { number: '03', title: 'Make it yours', text: 'A premium starting point that can be shaped around your brand, market, and audience.' },
];

function LandingPage() {
  return (
    <div className="landing">
      <header className="landingNav">
        <div className="landingBrand"><span className="brandSymbol">M</span><span>MONO</span></div>
        <nav aria-label="Preview navigation">
          <span>Experience</span>
          <span>Safety</span>
          <span>Global</span>
        </nav>
        <button className="navButton" type="button">Explore</button>
      </header>

      <main>
        <section className="heroLanding">
          <div className="heroOrb heroOrbOne" />
          <div className="heroOrb heroOrbTwo" />
          <div className="heroCopy">
            <p className="overline">THE UNIVERSAL MATCHING PLATFORM</p>
            <h1>Where the right<br /><em>connections</em> begin.</h1>
            <p className="heroLead">A sophisticated matching experience built to adapt across people, purposes, and markets — without losing its sense of trust.</p>
            <div className="heroActions">
              <button className="primaryButton" type="button">Discover the experience <span>↗</span></button>
              <span className="heroNote">A premium foundation for your next service</span>
            </div>
          </div>
          <div className="heroVisual" aria-hidden="true">
            <div className="portrait portraitBack"><div className="portraitFigure" /><span className="portraitInitial">Y</span></div>
            <div className="portrait portraitMain"><div className="portraitFigure" /><span className="portraitInitial">A</span></div>
            <div className="matchBadge"><span className="matchDot" /><div><strong>98% match</strong><small>Connection found</small></div></div>
            <div className="locationBadge"><span>◎</span> Anywhere in the world</div>
          </div>
          <div className="heroBottom"><span>SCROLL TO EXPLORE</span><span className="scrollLine" /></div>
        </section>

        <section className="introLanding">
          <p className="overline">ONE FOUNDATION / MANY POSSIBILITIES</p>
          <div className="introGrid">
            <h2>Not another<br /><em>single-purpose</em> app.</h2>
            <p>Build a dating service, a friendship community, a professional network, a local marketplace, or a completely new idea. The experience starts with one elegant foundation and becomes distinctly yours.</p>
          </div>
        </section>

        <section className="highlightLanding">
          {highlights.map((item) => (
            <article key={item.number} className="highlightCard">
              <span className="highlightNumber">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className="cardArrow">↗</span>
            </article>
          ))}
        </section>

        <section className="statementLanding">
          <div className="statementMark">M</div>
          <p className="overline">DESIGNED TO FEEL PREMIUM</p>
          <h2>Beautiful enough<br />to <em>belong.</em></h2>
          <p className="statementText">Quiet confidence. Clear decisions. Human moments. Every detail is designed to make connection feel considered rather than crowded.</p>
        </section>

        <section className="ctaLanding">
          <p className="overline">A NEW STARTING POINT</p>
          <h2>Start with a<br /><em>better foundation.</em></h2>
          <button className="primaryButton light" type="button">Discover what’s possible <span>↗</span></button>
        </section>
      </main>

      <footer className="landingFooter"><div className="landingBrand"><span className="brandSymbol">M</span><span>MONO</span></div><span>Universal matching platform</span><span>© 2026</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><LandingPage /></React.StrictMode>);
