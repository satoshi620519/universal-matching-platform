import React, { useEffect, useState } from 'react';
import type { AdministrativeConversationPage, AdministrativeConversationsApi } from './browser-administrative-conversations-api';

export function AdministrativeConversationDirectory({ api }: { api: AdministrativeConversationsApi }) {
  const [page, setPage] = useState<AdministrativeConversationPage>();
  const [cursor, setCursor] = useState<string>();
  const [history, setHistory] = useState<(string | undefined)[]>([]);
  const [error, setError] = useState<string>();
  useEffect(() => {
    let active = true; setPage(undefined); setError(undefined);
    api.list({ cursor, limit: 25 }).then(value => active && setPage(value)).catch(e => active && setError(e instanceof Error ? e.message : 'Unable to load conversations.'));
    return () => { active = false; };
  }, [api, cursor]);
  if (error) return <div className="card"><h2>Conversations unavailable</h2><p>{error}</p></div>;
  if (!page) return <div className="card"><h2>Conversations</h2><p>Loading conversation metadata…</p></div>;
  return <div className="card"><h2>Conversations</h2><p>Operational metadata only. Message contents are never displayed here.</p>
    <table><thead><tr><th>Created</th><th>Participants</th><th>Messages</th><th>Last activity</th><th>ID</th></tr></thead>
    <tbody>{page.items.map(x => <tr key={x.id}><td>{new Date(x.createdAt).toLocaleString()}</td><td>{x.participantCount}</td><td>{x.messageCount}</td><td>{x.lastMessageAt ? new Date(x.lastMessageAt).toLocaleString() : '—'}</td><td>{x.id}</td></tr>)}</tbody></table>
    <div className="actions"><button disabled={!history.length} onClick={() => { const previous = history.at(-1); setHistory(v => v.slice(0, -1)); setCursor(previous); }}>Previous</button>
    <button disabled={!page.nextCursor} onClick={() => { setHistory(v => [...v, cursor]); setCursor(page.nextCursor ?? undefined); }}>Next</button></div>
  </div>;
}
