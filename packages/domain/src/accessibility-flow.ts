export type EssentialInformationChannel =
  | 'text'
  | 'color'
  | 'sound'
  | 'motion'
  | 'gesture';

export interface AccessibilityFlow {
  readonly informationChannels: readonly EssentialInformationChannel[];
  readonly supportsTextScaling: boolean;
  readonly focusOrder: readonly string[];
  readonly focusVisible: boolean;
  readonly dynamicStatusMechanism?: string;
}

export function hasNonSensoryInformationChannel(
  flow: AccessibilityFlow,
): boolean {
  return flow.informationChannels.includes('text');
}

export function supportsAccessibleTextScaling(
  flow: AccessibilityFlow,
): boolean {
  return flow.supportsTextScaling;
}

export function hasPredictableFocus(
  flow: AccessibilityFlow,
): boolean {
  return (
    flow.focusVisible &&
    flow.focusOrder.length > 0 &&
    new Set(flow.focusOrder).size === flow.focusOrder.length
  );
}

export function communicatesDynamicStatus(
  flow: AccessibilityFlow,
): boolean {
  return (flow.dynamicStatusMechanism?.trim().length ?? 0) > 0;
}
