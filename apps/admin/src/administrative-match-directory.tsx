import React, { useEffect, useState } from 'react';
import type { AdministrativeMatchPage, AdministrativeMatchesApi } from './browser-administrative-matches-api';

export function AdministrativeMatchDirectory({ api }: { api: AdministrativeMatchesApi }) {
  const [page, setPage] = useState<AdministrativeMatchPage>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    let active = true; setPage(undefined); setError(undefined);
    api.list({ cursor, limit: 25 }).then(value => active && setPage(value)).catch(e => active && setError(e instanceof Error ? e.message : 'Unable to load matches.'));
    return () => { active = false; };
  }, [api, cursor]);
  if (error) return <div className="card"><h2>Matches unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Matches</h2><p>Loading match interactions…</p></div>;
  return <div className="card"><h2>Matches</h2><p>Operational interaction metadata for matching quality and abuse monitoring.</p>
    <table><thead><tr><th>Created</th><th>Decision</th><th>Actor</th><th>Target</th><th>ID</th></tr></thead>
    <tbody>{page.items.map(x => <tr key={x.id}><td>{new Date(x.createdAt).toLocaleString()}</td><td>{x.decision}</td><td>{x.actorAccountId}</td><td>{x.targetAccountId}</td><td>{x.id}</td></tr>)}</tbody></table>
    <div className="actions"><button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory(v => v.slice(0, -1)); setCursor(previous); }}>Previous</button>
    <button disabled={!page.nextCursor} onClick={() => { setHistory(v => [...v, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button></div>
  </div>;
}
