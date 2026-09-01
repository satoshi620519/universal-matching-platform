import { describe, expect, it, vi } from 'vitest';
import { ConfigurationDraftEditingService } from './configuration-draft-editing.service.js';

const input = { settingKey: 'matching.max-distance', valueType: 'integer' as const, scope: 'deployment' as const, value: 20n };
const definition = { key: input.settingKey, valueType: 'integer' as const, allowedScopes: ['deployment'] as const };

describe('ConfigurationDraftEditingService', () => {
  it('validates and persists a value only for an editable draft', async () => {
    const upsertDraftValue = vi.fn();
    const service = new ConfigurationDraftEditingService(
      { findDraft: vi.fn().mockResolvedValue({ id: 'v1', scope: 'deployment' }) } as any,
      { find: vi.fn().mockReturnValue(definition) } as any,
      { upsertDraftValue } as any,
    );
    await service.setValue('v1', input);
    expect(upsertDraftValue).toHaveBeenCalledWith(expect.objectContaining({ versionId: 'v1', settingKey: input.settingKey }));
  });

  it('rejects non-drafts and unknown settings before persistence', async () => {
    const upsertDraftValue = vi.fn();
    const versions = { findDraft: vi.fn().mockResolvedValue(undefined) };
    const definitions = { find: vi.fn().mockReturnValue(undefined) };
    const service = new ConfigurationDraftEditingService(versions as any, definitions as any, { upsertDraftValue } as any);
    await expect(service.setValue('v1', input)).rejects.toThrow('not an editable draft');
    expect(upsertDraftValue).not.toHaveBeenCalled();

    versions.findDraft.mockResolvedValue({ id: 'v1', scope: 'deployment' });
    await expect(service.setValue('v1', input)).rejects.toThrow('unknown configuration setting');
    expect(upsertDraftValue).not.toHaveBeenCalled();
  });
});
