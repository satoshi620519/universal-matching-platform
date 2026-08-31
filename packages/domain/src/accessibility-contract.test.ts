import { describe, expect, it } from 'vitest';
import {
  hasAccessibleControlMetadata,
  hasUniqueAccessibleInputModes,
  supportsEquivalentNavigation,
} from './accessibility-contract.js';

describe('accessibility control contract', () => {
  const control = {
    name: 'Open profile',
    role: 'button',
    state: 'enabled',
    supportedInputModes: ['keyboard', 'pointer'] as const,
  };

  it('requires accessible name, role and at least one input mode', () => {
    expect(hasAccessibleControlMetadata(control)).toBe(true);
    expect(
      hasAccessibleControlMetadata({ ...control, name: ' ' }),
    ).toBe(false);
  });

  it('supports keyboard or platform-equivalent navigation', () => {
    expect(supportsEquivalentNavigation(control)).toBe(true);
    expect(
      supportsEquivalentNavigation({
        ...control,
        supportedInputModes: ['pointer'],
      }),
    ).toBe(false);
  });

  it('rejects duplicate input mode declarations', () => {
    expect(hasUniqueAccessibleInputModes(control)).toBe(true);
    expect(
      hasUniqueAccessibleInputModes({
        ...control,
        supportedInputModes: ['keyboard', 'keyboard'],
      }),
    ).toBe(false);
  });
});
