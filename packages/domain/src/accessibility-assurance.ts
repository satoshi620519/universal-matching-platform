export interface TimeLimitedInteraction {
  readonly warningProvided: boolean;
  readonly extensionSupported: boolean;
  readonly alternativeBehaviorProvided: boolean;
}

export interface VisualInformation {
  readonly isImportant: boolean;
  readonly textAlternative?: string;
}

export interface AccessibilityPreferences {
  readonly platformSupportAvailable: boolean;
  readonly preferencesRespected: boolean;
}

export interface AccessibilityAcceptanceResult {
  readonly majorUserFlow: string;
  readonly passed: boolean;
}

export function supportsTimeLimitedInteractionAccessibility(
  interaction: TimeLimitedInteraction,
): boolean {
  return (
    interaction.warningProvided ||
    interaction.extensionSupported ||
    interaction.alternativeBehaviorProvided
  );
}

export function hasRequiredTextAlternative(
  information: VisualInformation,
): boolean {
  return (
    !information.isImportant ||
    (information.textAlternative?.trim().length ?? 0) > 0
  );
}

export function respectsAccessibilityPreferences(
  preferences: AccessibilityPreferences,
): boolean {
  return (
    !preferences.platformSupportAvailable || preferences.preferencesRespected
  );
}

export function passesAccessibilityAcceptance(
  results: readonly AccessibilityAcceptanceResult[],
): boolean {
  return (
    results.length > 0 &&
    results.every(
      (result) => result.majorUserFlow.trim().length > 0 && result.passed,
    )
  );
}
