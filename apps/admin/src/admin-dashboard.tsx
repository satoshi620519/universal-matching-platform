import React, { useEffect, useState } from 'react';
import { createAdminDashboardReadModel, type AdminDashboardReadModel } from './admin-dashboard-read-model';
import type { AdminDashboardApi } from './browser-admin-dashboard-api';

export function AdminDashboard({ api }: { api: AdminDashboardApi }) {
  const [model, setModel] = useState<AdminDashboardReadModel>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    api.read()
      .then((value) => active && setModel(createAdminDashboardReadModel(value)))
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : 'Unable to load dashboard.'));
    return () => { active = false; };
  }, [api]);

  if (error) return <div className="card"><h2>Dashboard unavailable</h2><p>{error}</p></div>;
  if (!model) return <div className="card"><h2>Dashboard</h2><p>Loading operational status…</p></div>;

  return <div className="card">
    <h2>Dashboard</h2>
    <p>Operational overview for this deployment.</p>
    <dl>
      <dt>System health</dt><dd>{model.systemHealth.status}</dd>
      <dt>Database</dt><dd>{model.systemHealth.database}</dd>
    </dl>
    <h3>Available administration</h3>
    <div className="chips">{model.availableSections.map((section) => <span key={section}>{section}</span>)}</div>
  </div>;
}
