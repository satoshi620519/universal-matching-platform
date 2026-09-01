import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_BASE_URL = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL ?? 'http://localhost:3000';

type AccessStatus = 'idle' | 'loading' | 'success' | 'error';

type Feature = { icon: string; title: string; text: string };
type Screen = 'home' | 'signin' | 'register';

const features: Feature[] = [
  { icon: '✦', title: 'Meaningful connections', text: 'A thoughtful space designed around real conversations.' },
  { icon: '◌', title: 'Privacy first', text: 'Your experience is built with clear boundaries and control.' },
  { icon: '↗', title: 'Global by design', text: 'A flexible foundation ready for communities across markets.' },
];

function AccessForm({ screen, onBack }: { screen: 'signin' | 'register'; onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AccessStatus>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('loading'); setMessage('');
    try {
      const response = await fetch(API_BASE_URL + (screen === 'signin' ? '/auth/sign-in' : '/auth/register'), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Request failed');
      if (screen === 'signin') {
        const body = await response.json() as { credential?: string };
        if (!body.credential) throw new Error('Invalid email or password');
        sessionStorage.setItem('connect.credential', body.credential);
        setMessage('Signed in successfully. Your secure session credential is stored for this browser session.');
      } else setMessage('Registration received. Please check your email for the verification step.');
      setStatus('success');
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.'); }
  }
  const title = screen === 'signin' ? 'Welcome back.' : 'Start your journey.';
  return <main className="accessPage">
    <nav><button className="brand plain" onClick={onBack}><span className="brandMark">C</span>connect</button><button className="textButton" onClick={onBack}>← Back</button></nav>
    <section className="accessCard">
      <div className="eyebrow">{screen === 'signin' ? 'WELCOME BACK' : 'CREATE YOUR ACCOUNT'}</div>
      <h1>{title}</h1>
      <p>{screen === 'signin' ? 'Sign in to continue your conversations and connections.' : 'Create your account and discover a more thoughtful way to connect.'}</p>
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required /></label>
        <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" minLength={8} required /></label>
        {screen === 'register' && <label className="check"><input type="checkbox" required /> <span>I agree to the Terms and Privacy Policy.</span></label>}
        <button className="primary wide" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Please wait…' : screen === 'signin' ? 'Sign in →' : 'Create account →'}</button>
        {status !== 'idle' && <div className={'accessMessage ' + status} role="status">{message}</div>}
      </form>
      <div className="accessHint">Secure access requests are sent to the configured platform API.</div>
    </section>
  </main>;
}

function Home({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <main>
    <nav>
      <div className="brand"><span className="brandMark">C</span>connect</div>
      <div className="navLinks"><a href="#experience">Experience</a><a href="#safety">Safety</a><button className="ghost" onClick={() => setScreen('signin')}>Sign in</button></div>
    </nav>
    <section className="hero">
      <div className="eyebrow">HUMAN CONNECTION, REIMAGINED</div>
      <h1>Meet beyond<br /><em>the ordinary.</em></h1>
      <p>A modern space for discovering people, starting conversations, and building meaningful connections.</p>
      <div className="actions"><button className="primary" onClick={() => setScreen('register')}>Start exploring <span>→</span></button><button className="textButton">How it works</button></div>
      <div className="proof"><div><strong>Private</strong><span>Designed for control</span></div><div><strong>Global</strong><span>Built without borders</span></div><div><strong>Thoughtful</strong><span>Human at the center</span></div></div>
    </section>
    <section id="experience" className="featureSection"><div className="sectionIntro"><span>01 / THE EXPERIENCE</span><h2>Less noise.<br />More <em>possibility.</em></h2></div><div className="featureGrid">{features.map((feature) => <article key={feature.title}><div className="featureIcon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p><a href="#start">Discover more →</a></article>)}</div></section>
    <section id="safety" className="statement"><span>BUILT FOR THE REAL WORLD</span><h2>Connection feels better<br />when trust comes first.</h2><p>Clear controls, thoughtful interactions, and a platform architecture designed to grow responsibly.</p></section>
    <footer id="start"><div className="brand"><span className="brandMark">C</span>connect</div><p>© 2026 Connect. A universal platform foundation.</p><button className="primary" onClick={() => setScreen('register')}>Get started →</button></footer>
  </main>;
}

function App() {
 const [screen, setScreen] = useState<Screen>('home');
 return screen === 'home' ? <Home setScreen={setScreen} /> : <AccessForm screen={screen} onBack={() => setScreen('home')} />;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
