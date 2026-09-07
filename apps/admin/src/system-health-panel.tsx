import React, { useEffect, useState } from 'react';

export interface SystemHealthApi {
  health(): Promise<{ status: 'ok'|'degraded'; database: 'configured'|'not-configured' }>;
}

export function SystemHealthPanel({ api }: { api: SystemHealthApi }) {
  const [value, setValue] = useState<{ status: 'ok'|'degraded'; database: 'configured'|'not-configured' }>();
  const [error, setError] = useState<string>();
  const load = () => { setError(undefined); api.health().then(setValue).catch(e => setError(e instanceof Error ? e.message : 'Unable to load system health.')); };
  useEffect(load, [api]);
  return <div className="card"><header><div><span>SYSTEM</span><h2>System Health</h2></div><button onClick={load}>Refresh</button></header>
    {error ? <p>{error}</p> : !value ? <p>Checking system health…</p> : <dl><dt>Overall status</dt><dd>{value.status}</dd><dt>Database</dt><dd>{value.database}</dd></dl>}
  </div>;
}
