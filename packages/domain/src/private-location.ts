export type PrivateLocation = Readonly<{
  latitude: number;
  longitude: number;
}>;

const EARTH_RADIUS_METERS = 6_371_000;

function assertFiniteCoordinate(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite`);
}

export function createPrivateLocation(input: PrivateLocation): PrivateLocation {
  assertFiniteCoordinate(input.latitude, 'latitude');
  assertFiniteCoordinate(input.longitude, 'longitude');
  if (input.latitude < -90 || input.latitude > 90) throw new Error('latitude must be between -90 and 90');
  if (input.longitude < -180 || input.longitude > 180) throw new Error('longitude must be between -180 and 180');
  return { latitude: input.latitude, longitude: input.longitude };
}

function toRadians(value: number): number {
  return value * (Math.PI / 180);
}

export function calculateDistanceMeters(a: PrivateLocation, b: PrivateLocation): number {
  const start = createPrivateLocation(a);
  const end = createPrivateLocation(b);
  const latitudeDelta = toRadians(end.latitude - start.latitude);
  const longitudeDelta = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(Math.min(1, haversine)));
}

export type DistanceConstraint = Readonly<{
  maxDistanceMeters: number;
}>;

export function validateDistanceConstraint(constraint: DistanceConstraint): void {
  if (!Number.isFinite(constraint.maxDistanceMeters) || constraint.maxDistanceMeters < 0) {
    throw new Error('maxDistanceMeters must be a finite non-negative number');
  }
}

export function isWithinDistance(
  subject: PrivateLocation,
  candidate: PrivateLocation,
  constraint: DistanceConstraint,
): boolean {
  validateDistanceConstraint(constraint);
  return calculateDistanceMeters(subject, candidate) <= constraint.maxDistanceMeters;
}
