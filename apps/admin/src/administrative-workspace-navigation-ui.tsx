import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserAdministrativeCapabilitiesApi } from './browser-administrative-capabilities-api';
import { visibleAdministrativeWorkspaceTargets, type AdministrativeWorkspaceTarget } from './administrative-workspace-navigation';

type Workspace = AdministrativeWorkspaceTarget['id'];

function mountWorkspaceNavigation() {
  const aside = document.querySelector('.shell aside');
  if (!aside || document.getElementById('administrative-workspace-navigation')) return;

  const container = document.createElement('nav');
  container.id = 'administrative-workspace-navigation';
  container.setAttribute('aria-label', 'Administrative workspaces');
  aside.appendChild(container);
  const root = createRoot(container);

  function Navigation() {
    const [targets, setTargets] = useState<AdministrativeWorkspaceTarget[]>([]);
    const [active, setActive] = useState<Workspace>('quick-launch');
    const [error, setError] = useState('');

    useEffect(() => {
      let cancelled = false;
      void createBrowserAdministrativeCapabilitiesApi().list()
        .then((capabilities) => {
          if (!cancelled) setTargets(visibleAdministrativeWorkspaceTargets(capabilities));
        })
        .catch((cause) => {
          if (!cancelled) setError(cause instanceof Error ? cause.message : 'Unable to load administrative capabilities.');
        });
      return () => { cancelled = true; };
    }, []);

    if (error) return <small role="status">Administrative navigation unavailable.</small>;
    if (!targets.length) return null;

    return <div style={{marginTop:22,display:'grid',gap:6}}>
      {targets.map((target) => <button
        key={target.id}
        type="button"
        aria-current={active === target.id ? 'page' : undefined}
        onClick={() => {
          setActive(target.id);
          document.dispatchEvent(new CustomEvent('universal-admin-workspace', { detail: target.id }));
        }}
        style={{padding:'10px 12px',border:'1px solid #536150',background:active===target.id?'rgba(255,255,255,.12)':'transparent',color:'#e9eee6',borderRadius:8,textAlign:'left',cursor:'pointer',font:'inherit',fontSize:11,letterSpacing:1.2}}
      >{target.label.toUpperCase()}</button>)}
    </div>;
  }

  root.render(<Navigation />);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountWorkspaceNavigation, { once: true });
else mountWorkspaceNavigation();
