import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Feature = { icon: string; title: string; text: string };

const features: Feature[] = [
  { icon: '✦', title: 'Meaningful connections', text: 'A thoughtful space designed around real conversations.' },
  { icon: '◌', title: 'Privacy first', text: 'Your experience is built with clear boundaries and control.' },
  { icon: '↗', title: 'Global by design', text: 'A flexible foundation ready for communities across markets.' },
];

function App() {
  return (
    <main>
      <nav>
        <div className="brand"><span className="brandMark">C</span>connect</div>
        <div className="navLinks"><a href="#experience">Experience</a><a href="#safety">Safety</a><button className="ghost">Sign in</button></div>
      </nav>

      <section className="hero">
        <div className="eyebrow">HUMAN CONNECTION, REIMAGINED</div>
        <h1>Meet beyond<br /><em>the ordinary.</em></h1>
        <p>A modern space for discovering people, starting conversations, and building meaningful connections.</p>
        <div className="actions"><button className="primary">Start exploring <span>→</span></button><button className="textButton">How it works</button></div>
        <div className="proof"><div><strong>Private</strong><span>Designed for control</span></div><div><strong>Global</strong><span>Built without borders</span></div><div><strong>Thoughtful</strong><span>Human at the center</span></div></div>
      </section>

      <section id="experience" className="featureSection">
        <div className="sectionIntro"><span>01 / THE EXPERIENCE</span><h2>Less noise.<br />More <em>possibility.</em></h2></div>
        <div className="featureGrid">{features.map((feature) => <article key={feature.title}><div className="featureIcon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p><a href="#start">Discover more →</a></article>)}</div>
      </section>

      <section id="safety" className="statement"><span>BUILT FOR THE REAL WORLD</span><h2>Connection feels better<br />when trust comes first.</h2><p>Clear controls, thoughtful interactions, and a platform architecture designed to grow responsibly.</p></section>

      <footer id="start"><div className="brand"><span className="brandMark">C</span>connect</div><p>© 2026 Connect. A universal platform foundation.</p><button className="primary">Get started →</button></footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
