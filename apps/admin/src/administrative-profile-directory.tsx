import React, { useEffect, useState } from 'react';
import type { AdministrativeProfilesApi, AdministrativeProfilePage } from './browser-administrative-profiles-api';

export function AdministrativeProfileDirectory({ api }: { api: AdministrativeProfilesApi }) {
  const [page, setPage] = useState<AdministrativeProfilePage>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setError(undefined);
    api.list({ cursor, limit: 25 }).then((value) => active && setPage(value))
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : 'Unable to load profiles.'));
    return () => { active = false; };
  }, [api, cursor]);

  if (error) return <div className="card"><h2>Profiles unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Profiles</h2><p>Loading profiles…</p></div>;

  return <div className="card">
    <h2>Profiles</h2><p>Privacy-safe administrative profile directory.</p>
    <table><thead><tr><th>Profile</th><th>Account</th><th>Category</th><th>Scope</th><th>Verification</th><th>Avatar</th></tr></thead>
      <tbody>{page.items.map((profile) => <tr key={profile.id}><td>{profile.id}</td><td>{profile.accountId}</td><td>{profile.categoryId}</td><td>{profile.scopeKind}</td><td>{profile.verificationStatus}</td><td>{profile.avatarStatus ?? '—'}</td></tr>)}</tbody>
    </table>
    <div className="actions"><button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory((value) => value.slice(0, -1)); setCursor(previous); }}>Previous</button>
      <button disabled={!page.nextCursor} onClick={() => { setHistory((value) => [...value, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button></div>
  </div>;
}
