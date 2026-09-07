import React, { useEffect, useState } from 'react';
import type { AdministrativeUsersApi, AdministrativeUserPage } from './browser-administrative-users-api';

export function AdministrativeUserDirectory({ api }: { api: AdministrativeUsersApi }) {
  const [page, setPage] = useState<AdministrativeUserPage>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setError(undefined);
    api.list({ cursor, limit: 25 })
      .then((value) => active && setPage(value))
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : 'Unable to load users.'));
    return () => { active = false; };
  }, [api, cursor]);

  if (error) return <div className="card"><h2>Users unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Users</h2><p>Loading users…</p></div>;

  return <div className="card">
    <h2>Users</h2>
    <p>Administrative account directory.</p>
    <table>
      <thead><tr><th>Account</th><th>Status</th><th>Created</th><th>Updated</th></tr></thead>
      <tbody>{page.items.map((user) => <tr key={user.id}><td>{user.id}</td><td>{user.status}</td><td>{new Date(user.createdAt).toLocaleString()}</td><td>{new Date(user.updatedAt).toLocaleString()}</td></tr>)}</tbody>
    </table>
    <div className="actions">
      <button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory((value) => value.slice(0, -1)); setCursor(previous); }}>Previous</button>
      <button disabled={!page.nextCursor} onClick={() => { setHistory((value) => [...value, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button>
    </div>
  </div>;
}
