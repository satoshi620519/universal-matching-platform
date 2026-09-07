import React, { useEffect, useState } from 'react';
import type { AdministrativeModerationApi, AdministrativeModerationPage, AdministrativeModerationReport, AdministrativeModerationCase, ModerationActionType } from './browser-administrative-moderation-api';

export function AdministrativeModerationDirectory({ api }: { api: AdministrativeModerationApi }) {
  const [tab, setTab] = useState<'reports' | 'cases'>('reports');
  const [page, setPage] = useState<AdministrativeModerationPage<AdministrativeModerationReport | AdministrativeModerationCase>>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState<string>();
  const [action, setAction] = useState<ModerationActionType>('warning');
  const [reasonCategory, setReasonCategory] = useState('policy-violation');

  useEffect(() => {
    let active = true;
    setPage(undefined); setError(undefined);
    const load = tab === 'reports' ? api.listReports({ cursor, limit: 25 }) : api.listCases({ cursor, limit: 25 });
    load.then(value => active && setPage(value)).catch(reason => active && setError(reason instanceof Error ? reason.message : 'Unable to load moderation data.'));
    return () => { active = false; };
  }, [api, tab, cursor]);

  const mutate = async (key: string, operation: () => Promise<unknown>) => {
    setBusy(key); setError(undefined);
    try { await operation(); setCursor(undefined); setHistory([]); setPage(undefined); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update moderation data.'); }
    finally { setBusy(undefined); }
  };
  const changeTab = (next: 'reports' | 'cases') => { setTab(next); setCursor(undefined); setHistory([]); };
  if (error) return <div className="card"><h2>Moderation unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Moderation</h2><p>Loading moderation data…</p></div>;

  return <div className="card">
    <h2>Moderation</h2>
    <div className="actions"><button onClick={() => changeTab('reports')} disabled={tab === 'reports'}>Reports</button><button onClick={() => changeTab('cases')} disabled={tab === 'cases'}>Cases</button></div>
    {tab === 'reports'
      ? <table><thead><tr><th>Report</th><th>Target</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{(page.items as readonly AdministrativeModerationReport[]).map(x => <tr key={x.id}><td>{x.id}</td><td>{x.targetId}</td><td>{x.targetType}</td><td>{x.status}</td><td><button disabled={!!busy} onClick={() => mutate(x.id, () => api.openCase(x.id))}>Open case</button><button disabled={!!busy} onClick={() => mutate(x.id + '-triage', () => api.transitionReport(x.id, 'triaged'))}>Triage</button><button disabled={!!busy} onClick={() => mutate(x.id + '-dismiss', () => api.transitionReport(x.id, 'dismissed'))}>Dismiss</button></td></tr>)}</tbody></table>
      : <table><thead><tr><th>Case</th><th>Report</th><th>Status</th><th>Actions</th></tr></thead><tbody>{(page.items as readonly AdministrativeModerationCase[]).map(x => <tr key={x.id}><td>{x.id}</td><td>{x.reportId}</td><td>{x.status}</td><td><select value={action} disabled={!!busy} onChange={e => setAction(e.target.value as ModerationActionType)}><option value="warning">Warning</option><option value="restrict-features">Restrict features</option><option value="restrict-communication">Restrict communication</option><option value="suspend">Suspend</option><option value="close-without-action">Close without action</option></select><input value={reasonCategory} disabled={!!busy} onChange={e => setReasonCategory(e.target.value)} placeholder="Reason category"/><button disabled={!!busy || !reasonCategory.trim()} onClick={() => mutate(x.id + '-action', () => api.applyAction(x.id, { targetId: x.targetId, action, reasonCategory }))}>Apply</button><button disabled={!!busy} onClick={() => mutate(x.id + '-review', () => api.transitionCase(x.id, 'under-review'))}>Review</button><button disabled={!!busy} onClick={() => mutate(x.id + '-close', () => api.transitionCase(x.id, 'closed'))}>Close</button></td></tr>)}</tbody></table>}
    <div className="actions"><button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory(v => v.slice(0, -1)); setCursor(previous); }}>Previous</button><button disabled={!page.nextCursor} onClick={() => { setHistory(v => [...v, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button></div>
  </div>;
}
