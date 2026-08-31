export type AccessibilityInputMode =
  | 'keyboard'
  | 'pointer'
  | 'platform-equivalent';

export interface AccessibilityControl {
  readonly name: string;
  readonly role: string;
  readonly state?: string;
  readonly supportedInputModes: readonly AccessibilityInputMode[];
}

export function hasAccessibleControlMetadata(
  control: AccessibilityControl,
): boolean {
  return (
    control.name.trim().length > 0 &&
    control.role.trim().length > 0 &&
    control.supportedInputModes.length > 0
  );
}

export function supportsEquivalentNavigation(
  control: AccessibilityControl,
): boolean {
  return control.supportedInputModes.some(
    (mode) => mode === 'keyboard' || mode === 'platform-equivalent',
  );
}

export function hasUniqueAccessibleInputModes(
  control: AccessibilityControl,
): boolean {
  return new Set(control.supportedInputModes).size === control.supportedInputModes.length;
}
