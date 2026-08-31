import { describe, expect, it } from 'vitest';
import {
  hasRequiredTextAlternative,
  passesAccessibilityAcceptance,
  respectsAccessibilityPreferences,
  supportsTimeLimitedInteractionAccessibility,
} from './accessibility-assurance.js';

describe('accessibility assurance contract', () => {
  it('accepts warning, extension or alternative behavior for time limits', () => {
    expect(
      supportsTimeLimitedInteractionAccessibility({
        warningProvided: false,
        extensionSupported: true,
        alternativeBehaviorProvided: false,
      }),
    ).toBe(true);
  });

  it('requires text alternatives for important visual information', () => {
    expect(
      hasRequiredTextAlternative({
        isImportant: true,
        textAlternative: 'Account verification status',
      }),
    ).toBe(true);
    expect(
      hasRequiredTextAlternative({
        isImportant: true,
        textAlternative: ' ',
      }),
    ).toBe(false);
  });

  it('requires supported platform accessibility preferences to be respected', () => {
    expect(
      respectsAccessibilityPreferences({
        platformSupportAvailable: true,
        preferencesRespected: true,
      }),
    ).toBe(true);
    expect(
      respectsAccessibilityPreferences({
        platformSupportAvailable: true,
        preferencesRespected: false,
      }),
    ).toBe(false);
  });

  it('requires every major user flow acceptance result to pass', () => {
    expect(
      passesAccessibilityAcceptance([
        { majorUserFlow: 'authentication', passed: true },
        { majorUserFlow: 'discovery', passed: true },
      ]),
    ).toBe(true);
    expect(
      passesAccessibilityAcceptance([
        { majorUserFlow: 'authentication', passed: true },
        { majorUserFlow: 'messaging', passed: false },
      ]),
    ).toBe(false);
  });
});
