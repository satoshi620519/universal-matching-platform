import React, { useEffect, useState } from 'react';
import type { AdministrativeAuditApi, AdministrativeAuditPage } from './browser-administrative-audit-api';

export function AdministrativeAuditDirectory({ api }: { api: AdministrativeAuditApi }) {
  const [page, setPage] = useState<AdministrativeAuditPage>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setPage(undefined); setError(undefined);
    api.list({ cursor, limit: 25 }).then(value => active && setPage(value)).catch(reason => active && setError(reason instanceof Error ? reason.message : 'Unable to load audit logs.'));
    return () => { active = false; };
  }, [api, cursor]);

  if (error) return <div className="card"><h2>Audit logs unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Audit Logs</h2><p>Loading audit logs…</p></div>;

  return <div className="card">
    <h2>Audit Logs</h2>
    <table><thead><tr><th>When</th><th>Area</th><th>Action</th><th>Actor</th><th>Target</th><th>Correlation</th></tr></thead>
      <tbody>{page.items.map(x => <tr key={x.id}><td>{new Date(x.occurredAt).toLocaleString()}</td><td>{x.area}</td><td>{x.action}</td><td>{x.actorId}</td><td>{x.targetId ?? '—'}</td><td>{x.correlationId ?? '—'}</td></tr>)}</tbody>
    </table>
    <div className="actions">
      <button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory(v => v.slice(0, -1)); setCursor(previous); }}>Previous</button>
      <button disabled={!page.nextCursor} onClick={() => { setHistory(v => [...v, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button>
    </div>
  </div>;
}
