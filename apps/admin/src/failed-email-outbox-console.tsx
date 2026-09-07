import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserFailedEmailOutboxApi, type FailedEmailOutboxItem } from './browser-failed-email-outbox-api';

function mountFailedEmailOutbox() {
  if (document.getElementById('failed-email-outbox-console-root')) return;
  const container = document.createElement('div');
  container.id = 'failed-email-outbox-console-root';
  container.hidden = true;
  document.body.appendChild(container);
  const root = createRoot(container);

  function Workspace() {
    const api = createBrowserFailedEmailOutboxApi();
    const [items, setItems] = useState<readonly FailedEmailOutboxItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const refresh = async () => {
      setLoading(true); setError('');
      try { setItems(await api.list()); }
      catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load failed email outbox.'); }
      finally { setLoading(false); }
    };

    useEffect(() => {
      const onWorkspace = (event: Event) => {
        if ((event as CustomEvent).detail === 'failed-email') {
          container.hidden = false;
          void refresh();
        }
      };
      document.addEventListener('universal-admin-workspace', onWorkspace);
      return () => document.removeEventListener('universal-admin-workspace', onWorkspace);
    }, []);

    if (container.hidden) return null;
    return <section aria-label="Failed email outbox" style={{position:'fixed',inset:'5%',background:'#172016',color:'#e9eee6',padding:24,overflow:'auto',zIndex:20,border:'1px solid #536150',borderRadius:12}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>Failed email outbox</h2><button onClick={() => { container.hidden = true; root.render(<Workspace />); }}>Close</button></header>
      <button disabled={loading} onClick={() => void refresh()}>{loading ? 'Loading…' : 'Refresh'}</button>
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <ul>{items.map((item) => <li key={item.id} style={{margin:'12px 0'}}><code>{item.id}</code>{' '}<button onClick={async () => { await api.requeue(item.id); await refresh(); }}>Requeue</button></li>)}</ul>}
    </section>;
  }

  root.render(<Workspace />);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountFailedEmailOutbox, { once: true });
else mountFailedEmailOutbox();
