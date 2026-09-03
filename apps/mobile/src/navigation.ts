export type PublicDestination = 'sign-in' | 'registration' | 'verification';

export type ProtectedDestination =
  | 'home'
  | 'discovery'
  | 'matches'
  | 'conversations'
  | 'profile'
  | 'settings'
  | 'safety';

export type Destination = PublicDestination | ProtectedDestination;

const protectedDestinations = new Set<Destination>([
  'home',
  'discovery',
  'matches',
  'conversations',
  'profile',
  'settings',
  'safety',
]);

export function requiresAuthentication(destination: Destination): boolean {
  return protectedDestinations.has(destination);
}

export function canAccessDestination(
  destination: Destination,
  authenticated: boolean,
): boolean {
  return !requiresAuthentication(destination) || authenticated;
}
