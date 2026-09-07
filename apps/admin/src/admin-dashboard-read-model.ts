export interface AdminDashboardReadModel {
  readonly systemHealth: {
    readonly status: 'ok' | 'degraded';
    readonly database: 'configured' | 'not-configured';
  };
  readonly availableSections: readonly string[];
}

export function createAdminDashboardReadModel(input: AdminDashboardReadModel): AdminDashboardReadModel {
  return {
    systemHealth: { ...input.systemHealth },
    availableSections: [...input.availableSections],
  };
}
