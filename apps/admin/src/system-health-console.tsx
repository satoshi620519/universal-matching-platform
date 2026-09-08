import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserHealthApi, type SystemHealth } from './browser-health-api';

function mountSystemHealthConsole() {
  function Console() {
    const [health,setHealth]=useState<SystemHealth>();
    const [error,setError]=useState('');
    const load=async()=>{setError('');try{setHealth(await createBrowserHealthApi().get());}catch(e){setError(e instanceof Error?e.message:'Unable to load system health.');}};
    useEffect(()=>{void load();},[]);
    return <section id="system-health-console" hidden>
      <h2>System health</h2>
      <button onClick={()=>void load()}>Refresh</button>
      {error&&<p role="status">{error}</p>}
      {health&&<dl><dt>Overall</dt><dd>{health.status}</dd><dt>Database</dt><dd>{health.database}</dd><dt>Jobs</dt><dd>{health.jobs}</dd><dt>Queue</dt><dd>{health.queue}</dd></dl>}
    </section>;
  }
  const host=document.createElement('div'); document.body.appendChild(host); createRoot(host).render(<Console/>);
  document.addEventListener('universal-admin-workspace',(event:Event)=>{const target=(event as CustomEvent<string>).detail; const section=document.getElementById('system-health-console'); if(section) section.hidden=target!=='system-health';});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountSystemHealthConsole,{once:true}); else mountSystemHealthConsole();
