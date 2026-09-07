import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserAdministrativeRoleManagementApi, type AdministrativeRole } from './browser-administrative-role-management-api';

function mountAdministrativeRolesConsole() {
  if (document.getElementById('administrative-roles-console-root')) return;
  const container = document.createElement('div');
  container.id = 'administrative-roles-console-root';
  container.hidden = true;
  document.body.appendChild(container);
  const root = createRoot(container);

  function Workspace() {
    const api = createBrowserAdministrativeRoleManagementApi();
    const [accountId, setAccountId] = useState('');
    const [role, setRole] = useState<AdministrativeRole>('moderator');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
      const onWorkspace = (event: Event) => {
        if ((event as CustomEvent).detail === 'roles') container.hidden = false;
      };
      document.addEventListener('universal-admin-workspace', onWorkspace);
      return () => document.removeEventListener('universal-admin-workspace', onWorkspace);
    }, []);

    const run = async (action: 'assign' | 'revoke') => {
      setBusy(true); setMessage('');
      try {
        if (action === 'assign') {
          await api.assign({ accountId, role });
          setMessage('Role assigned.');
        } else {
          const revoked = await api.revoke({ accountId, role });
          setMessage(revoked ? 'Role revoked.' : 'No active role assignment was revoked.');
        }
      } catch (cause) {
        setMessage(cause instanceof Error ? cause.message : 'Role operation failed.');
      } finally { setBusy(false); }
    };

    if (container.hidden) return null;
    return <section aria-label="Administrative roles" style={{position:'fixed',inset:'5%',background:'#172016',color:'#e9eee6',padding:24,overflow:'auto',zIndex:20,border:'1px solid #536150',borderRadius:12}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2>Administrative roles</h2><button onClick={() => { container.hidden = true; }}>Close</button></header>
      <p>Changes use the existing capability-checked and audited role-management API.</p>
      <label>Account ID<input value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={busy} /></label>
      <label>Role<select value={role} onChange={(event) => setRole(event.target.value as AdministrativeRole)} disabled={busy}><option value="administrator">Administrator</option><option value="moderator">Moderator</option></select></label>
      <div style={{display:'flex',gap:8,marginTop:16}}>
        <button disabled={busy || !accountId.trim()} onClick={() => void run('assign')}>Assign</button>
        <button disabled={busy || !accountId.trim()} onClick={() => void run('revoke')}>Revoke</button>
      </div>
      {message && <p role="status">{message}</p>}
    </section>;
  }

  root.render(<Workspace />);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountAdministrativeRolesConsole, { once: true });
else mountAdministrativeRolesConsole();
