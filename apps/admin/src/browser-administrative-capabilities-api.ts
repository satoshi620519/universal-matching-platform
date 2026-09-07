export type AdministrativeCapability =
  | 'manage-administrative-roles'
  | 'review-failed-email-outbox'
  | 'manage-moderation'
  | 'manage-quick-launch';

export type AdministrativeCapabilitiesApi = Readonly<{
  list(): Promise<AdministrativeCapability[]>;
}>;

export function createBrowserAdministrativeCapabilitiesApi(
  fetchImpl: typeof fetch = fetch,
): AdministrativeCapabilitiesApi {
  const configuredBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : '';

  return {
    async list() {
      const response = await fetchImpl(`${baseUrl}/administration/me/capabilities`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(detail || `Administrative capability request failed (${response.status})`);
      }
      const result = await response.json() as { capabilities?: unknown };
      return Array.isArray(result.capabilities)
        ? result.capabilities.filter((value): value is AdministrativeCapability => typeof value === 'string')
        : [];
    },
  };
}
