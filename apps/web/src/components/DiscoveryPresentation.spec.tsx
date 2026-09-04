import { describe, expect, it } from 'vitest';
import { DISCOVERY_PRESENTATION_MODES, isDiscoveryPresentationMode } from './DiscoveryPresentation';

describe('DiscoveryPresentation', () => {
  it('supports the roadmap presentation modes', () => {
    expect(DISCOVERY_PRESENTATION_MODES).toEqual(['card', 'list', 'grid']);
    expect(isDiscoveryPresentationMode('list')).toBe(true);
    expect(isDiscoveryPresentationMode('table')).toBe(false);
  });
});
