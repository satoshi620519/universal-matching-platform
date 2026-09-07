import React, { useEffect, useState } from 'react';
import type { AdministrativeModerationApi, AdministrativeModerationPage, AdministrativeModerationReport, AdministrativeModerationCase } from './browser-administrative-moderation-api';

export function AdministrativeModerationDirectory({ api }: { api: AdministrativeModerationApi }) {
  const [tab, setTab] = useState<'reports' | 'cases'>('reports');
  const [page, setPage] = useState<AdministrativeModerationPage<AdministrativeModerationReport | AdministrativeModerationCase>>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setPage(undefined); setError(undefined);
    const load = tab === 'reports' ? api.listReports({ cursor, limit: 25 }) : api.listCases({ cursor, limit: 25 });
    load.then(value => active && setPage(value)).catch(reason => active && setError(reason instanceof Error ? reason.message : 'Unable to load moderation data.'));
    return () => { active = false; };
  }, [api, tab, cursor]);

  const changeTab = (next: 'reports' | 'cases') => { setTab(next); setCursor(undefined); setHistory([]); };
  if (error) return <div className="card"><h2>Moderation unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Moderation</h2><p>Loading moderation data…</p></div>;

  return <div className="card">
    <h2>Moderation</h2>
    <div className="actions"><button onClick={() => changeTab('reports')} disabled={tab === 'reports'}>Reports</button><button onClick={() => changeTab('cases')} disabled={tab === 'cases'}>Cases</button></div>
    {tab === 'reports' ? <table><thead><tr><th>Report</th><th>Target</th><th>Type</th><th>Status</th></tr></thead><tbody>{(page.items as readonly AdministrativeModerationReport[]).map(x => <tr key={x.id}><td>{x.id}</td><td>{x.targetId}</td><td>{x.targetType}</td><td>{x.status}</td></tr>)}</tbody></table>
      : <table><thead><tr><th>Case</th><th>Report</th><th>Status</th></tr></thead><tbody>{(page.items as readonly AdministrativeModerationCase[]).map(x => <tr key={x.id}><td>{x.id}</td><td>{x.reportId}</td><td>{x.status}</td></tr>)}</tbody></table>}
    <div className="actions"><button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory(v => v.slice(0, -1)); setCursor(previous); }}>Previous</button><button disabled={!page.nextCursor} onClick={() => { setHistory(v => [...v, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button></div>
  </div>;
}
