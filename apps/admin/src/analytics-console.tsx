import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserAnalyticsApi, type ReportingPeriod } from './browser-analytics-api';

function mountAnalytics() {
  if (document.getElementById('analytics-console-root')) return;
  const container = document.createElement('div'); container.id = 'analytics-console-root'; document.body.appendChild(container);
  const root = createRoot(container);
  function Workspace() {
    const api = createBrowserAnalyticsApi(); const [period, setPeriod] = useState<ReportingPeriod>('month'); const [business, setBusiness] = useState<unknown>(); const [safety, setSafety] = useState<unknown>(); const [error, setError] = useState(''); const [open, setOpen] = useState(false);
    const refresh = async () => { setError(''); try { const [b,s] = await Promise.all([api.business(period), api.safety(period)]); setBusiness(b); setSafety(s); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load analytics.'); } };
    useEffect(() => { const listener=(event:Event)=>{ if((event as CustomEvent).detail==='analytics'){setOpen(true);void refresh();} }; document.addEventListener('universal-admin-workspace',listener); return()=>document.removeEventListener('universal-admin-workspace',listener); }, [period]);
    if (!open) return null;
    return <section role="dialog" aria-modal="true" aria-label="Analytics workspace" style={{position:'fixed',inset:'5%',zIndex:20,overflow:'auto',background:'#fffefa',padding:24,borderRadius:12}}><header style={{display:'flex',justifyContent:'space-between'}}><div><h2>Analytics</h2><p>Business and safety metrics for the selected reporting period.</p></div><button onClick={()=>setOpen(false)}>Close</button></header><label>Period <select value={period} onChange={e=>setPeriod(e.target.value as ReportingPeriod)}>{['day','week','month','quarter','year'].map(p=><option key={p}>{p}</option>)}</select></label><button onClick={()=>void refresh()} style={{marginLeft:8}}>Refresh</button>{error&&<p role="alert">{error}</p>}<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:20}}><article><h3>Business</h3><pre>{business?JSON.stringify(business,null,2):'Loading…'}</pre></article><article><h3>Safety</h3><pre>{safety?JSON.stringify(safety,null,2):'Loading…'}</pre></article></div></section>;
  }
  root.render(<Workspace />);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountAnalytics,{once:true}); else mountAnalytics();
