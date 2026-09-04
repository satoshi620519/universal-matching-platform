import { describe, expect, it } from 'vitest';
import { evaluateDiscoveryEligibility } from './discovery-eligibility.js';

const base = { id: 'p', accountId: 'other', categoryId: 'dating', fields: {}, geographicScope: { kind: 'global' } as const };

describe('discovery eligibility baseline', () => {
  it('excludes the subject from its own discovery results', () => {
    expect(evaluateDiscoveryEligibility('other', 'dating', 'JP', base)).toMatchObject({ eligible: false, reason: 'self' });
  });
  it('excludes another category', () => {
    expect(evaluateDiscoveryEligibility('subject', 'friends', 'JP', base)).toMatchObject({ eligible: false, reason: 'category' });
  });
  it('respects country geography and permits global candidates', () => {
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: { kind: 'country', countryCode: 'US' } })).toMatchObject({ eligible: false, reason: 'geography' });
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', base)).toMatchObject({ eligible: true });
  });
  it('matches region and city hierarchically', () => {
    const subject = { kind: 'city', countryCode: 'JP', regionCode: '13', localityCode: '13101' } as const;
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: { kind: 'country', countryCode: 'JP' } }, subject).eligible).toBe(true);
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: { kind: 'region', countryCode: 'JP', regionCode: '13' } }, subject).eligible).toBe(true);
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: subject }, subject).eligible).toBe(true);
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: { kind: 'region', countryCode: 'JP', regionCode: '27' } }, subject)).toMatchObject({ eligible: false, reason: 'geography' });
    expect(evaluateDiscoveryEligibility('subject', 'dating', 'JP', { ...base, geographicScope: { kind: 'city', countryCode: 'JP', regionCode: '13', localityCode: '13102' } }, subject)).toMatchObject({ eligible: false, reason: 'geography' });
  });
});
