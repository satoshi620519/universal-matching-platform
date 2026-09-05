import type { ReactNode } from 'react';

export type DiscoveryPresentationMode = 'card' | 'list' | 'grid';

export const DISCOVERY_PRESENTATION_MODES: readonly DiscoveryPresentationMode[] = ['card', 'list', 'grid'];

export function isDiscoveryPresentationMode(value: string): value is DiscoveryPresentationMode {
  return DISCOVERY_PRESENTATION_MODES.includes(value as DiscoveryPresentationMode);
}

export function DiscoveryPresentation({
  mode,
  children,
}: {
  mode: DiscoveryPresentationMode;
  children: ReactNode;
}) {
  return <div className={`discoveryPresentation discoveryPresentation--${mode}`} aria-live="polite">{children}</div>;
}
