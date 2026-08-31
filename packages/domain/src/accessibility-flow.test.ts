import { describe, expect, it } from 'vitest';
import {
  communicatesDynamicStatus,
  hasNonSensoryInformationChannel,
  hasPredictableFocus,
  supportsAccessibleTextScaling,
} from './accessibility-flow.js';

describe('accessibility flow contract', () => {
  const accessibleFlow = {
    informationChannels: ['text', 'color'] as const,
    supportsTextScaling: true,
    focusOrder: ['search', 'results', 'details'],
    focusVisible: true,
    dynamicStatusMechanism: 'aria-live',
  };

  it('does not rely only on sensory channels for essential information', () => {
    expect(hasNonSensoryInformationChannel(accessibleFlow)).toBe(true);
    expect(
      hasNonSensoryInformationChannel({
        ...accessibleFlow,
        informationChannels: ['color'],
      }),
    ).toBe(false);
  });

  it('requires support for interface text scaling', () => {
    expect(supportsAccessibleTextScaling(accessibleFlow)).toBe(true);
    expect(
      supportsAccessibleTextScaling({
        ...accessibleFlow,
        supportsTextScaling: false,
      }),
    ).toBe(false);
  });

  it('requires visible and non-duplicated predictable focus order', () => {
    expect(hasPredictableFocus(accessibleFlow)).toBe(true);
    expect(
      hasPredictableFocus({
        ...accessibleFlow,
        focusOrder: ['search', 'search'],
      }),
    ).toBe(false);
  });

  it('requires a platform mechanism for dynamic status communication', () => {
    expect(communicatesDynamicStatus(accessibleFlow)).toBe(true);
    expect(
      communicatesDynamicStatus({
        ...accessibleFlow,
        dynamicStatusMechanism: ' ',
      }),
    ).toBe(false);
  });
});
