import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getAuthenticatedAccount, register, signIn, verifyEmail, type Account } from './api';
import './styles.css';

type Feature = { icon: string; title: string; text: string };
type Screen = 'home' | 'signin' | 'register' | 'verify' | 'dashboard';
type AccessStatus = 'idle' | 'loading' | 'success' | 'error';

const features: Feature[] = [
  { icon: '✦', title: 'Meaningful connections', text: 'A thoughtful space designed around real conversations.' },
  { icon: '◌', title: 'Privacy first', text: 'Your experience is built with clear boundaries and control.' },
  { icon: '↗', title: 'Global by design', text: 'A flexible foundation ready for communities across markets.' },
];

function AccessForm({ screen, onBack, onSignedIn }: { screen: 'signin' | 'register'; onBack: () => void; onSignedIn: () => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AccessStatus>('idle'); const [message, setMessage] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('loading'); setMessage('');
    try {
      if (screen === 'signin') {
        const body = await signIn(email, password);
        if (!body.credential) throw new Error('Invalid email or password');
        sessionStorage.setItem('connect.credential', body.credential);
        setStatus('success'); setMessage('Signed in successfully. Loading your account…');
        onSignedIn();
      } else {
        await register(email, password);
        setStatus('success'); setMessage('Registration received. Please check your email for the verification step.');
      }
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.'); }
  }
  const title = screen === 'signin' ? 'Welcome back.' : 'Start your journey.';
  return <main className="accessPage"><nav><button className="brand plain" onClick={onBack}><span className="brandMark">C</span>connect</button><button className="textButton" onClick={onBack}>← Back</button></nav>
    <section className="accessCard"><div className="eyebrow">{screen === 'signin' ? 'WELCOME BACK' : 'CREATE YOUR ACCOUNT'}</div><h1>{title}</h1><p>{screen === 'signin' ? 'Sign in to continue your conversations and connections.' : 'Create your account and discover a more thoughtful way to connect.'}</p>
      <form onSubmit={submit}><label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required /></label><label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" minLength={8} required /></label>
      {screen === 'register' && <label className="check"><input type="checkbox" required /> <span>I agree to the Terms and Privacy Policy.</span></label>}
      <button className="primary wide" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Please wait…' : screen === 'signin' ? 'Sign in →' : 'Create account →'}</button>
      {status !== 'idle' && <div className={'accessMessage ' + status} role="status">{message}</div>}
      {screen === 'register' && status === 'success' && <a className="textButton verifyLink" href="#verify">Already have a token? Verify email →</a>}
      </form></section></main>;
}

function VerifyEmail({ onBack }: { onBack: () => void }) {
 const [token,setToken]=useState(''); const [status,setStatus]=useState<AccessStatus>('idle'); const [message,setMessage]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setStatus('loading');setMessage('');try{const body=await verifyEmail(token);if(!body.verified)throw new Error('This verification link is invalid or has expired.');setStatus('success');setMessage('Email verified successfully. You can now sign in.');}catch(error){setStatus('error');setMessage(error instanceof Error?error.message:'Verification failed.');}}
 return <main className="accessPage"><nav><button className="brand plain" onClick={onBack}><span className="brandMark">C</span>connect</button><button className="textButton" onClick={onBack}>← Back</button></nav><section className="accessCard"><div className="eyebrow">VERIFY YOUR EMAIL</div><h1>One last step.</h1><p>Paste the verification token from your email to activate your account.</p><form onSubmit={submit}><label>Verification token<input value={token} onChange={(e)=>setToken(e.target.value)} placeholder="Paste your secure token" required /></label><button className="primary wide" disabled={status==='loading'} type="submit">{status==='loading'?'Verifying…':'Verify email →'}</button>{status!=='idle'&&<div className={'accessMessage '+status} role="status">{message}</div>}</form></section></main>;
}

function Dashboard({ account, loading, error, onSignOut }: { account: Account | null; loading: boolean; error: string; onSignOut: () => void }) {
 return <main className="dashboard"><nav><div className="brand"><span className="brandMark">C</span>connect</div><button className="ghost" onClick={onSignOut}>Sign out</button></nav><section className="dashboardHero"><div><div className="eyebrow">YOUR SPACE</div><h1>Welcome to<br/><em>Connect.</em></h1><p>Your account is securely connected to the platform.</p></div><div className="accountPanel">{loading?<p>Loading your account…</p>:error?<><h3>We couldn't load your account.</h3><p>{error}</p></>:account?<><span className="panelLabel">ACCOUNT STATUS</span><strong>{account.status}</strong><span className="panelLabel">MEMBER SINCE</span><p>{new Date(account.createdAt).toLocaleDateString()}</p><span className="panelLabel">ACCOUNT ID</span><code>{account.id}</code></>:null}</div></section><section className="dashboardNext"><span>COMING NEXT</span><h2>Your conversations and notifications will live here.</h2><p>The next product slice connects this authenticated state to the existing messaging API rather than inventing parallel data.</p></section></main>;
}

function Home({ setScreen }: { setScreen: (screen: Screen) => void }) { return <main><nav><div className="brand"><span className="brandMark">C</span>connect</div><div className="navLinks"><a href="#experience">Experience</a><a href="#safety">Safety</a><button className="ghost" onClick={() => setScreen('signin')}>Sign in</button></div></nav><section className="hero"><div className="eyebrow">HUMAN CONNECTION, REIMAGINED</div><h1>Meet beyond<br/><em>the ordinary.</em></h1><p>A modern space for discovering people, starting conversations, and building meaningful connections.</p><div className="actions"><button className="primary" onClick={() => setScreen('register')}>Start exploring <span>→</span></button><button className="textButton">How it works</button></div><div className="proof"><div><strong>Private</strong><span>Designed for control</span></div><div><strong>Global</strong><span>Built without borders</span></div><div><strong>Thoughtful</strong><span>Human at the center</span></div></div></section><section id="experience" className="featureSection"><div className="sectionIntro"><span>01 / THE EXPERIENCE</span><h2>Less noise.<br/>More <em>possibility.</em></h2></div><div className="featureGrid">{features.map(feature=><article key={feature.title}><div className="featureIcon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p><a href="#start">Discover more →</a></article>)}</div></section><section id="safety" className="statement"><span>BUILT FOR THE REAL WORLD</span><h2>Connection feels better<br/>when trust comes first.</h2><p>Clear controls, thoughtful interactions, and a platform architecture designed to grow responsibly.</p></section><footer id="start"><div className="brand"><span className="brandMark">C</span>connect</div><p>© 2026 Connect. A universal platform foundation.</p><button className="primary" onClick={() => setScreen('register')}>Get started →</button></footer></main>; }

function App(){const [screen,setScreen]=useState<Screen>(()=>window.location.hash==='#verify'?'verify':sessionStorage.getItem('connect.credential')?'dashboard':'home');const [account,setAccount]=useState<Account|null>(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{const sync=()=>setScreen(window.location.hash==='#verify'?'verify':'home');window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);},[]);
 useEffect(()=>{if(screen!=='dashboard')return;setLoading(true);setError('');getAuthenticatedAccount().then(setAccount).catch(e=>{setError(e instanceof Error?e.message:'Account lookup failed');sessionStorage.removeItem('connect.credential');}).finally(()=>setLoading(false));},[screen]);
 const signOut=()=>{sessionStorage.removeItem('connect.credential');setAccount(null);setScreen('home');};
 if(screen==='home')return <Home setScreen={setScreen}/>;if(screen==='verify')return <VerifyEmail onBack={()=>setScreen('home')}/>;if(screen==='dashboard')return <Dashboard account={account} loading={loading} error={error} onSignOut={signOut}/>;return <AccessForm screen={screen} onBack={()=>setScreen('home')} onSignedIn={()=>setScreen('dashboard')}/>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
