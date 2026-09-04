import type { Profile, ProfileFieldValue } from './profile.js';
import type { ProfileSchemaConfiguration } from './profile-schema-configuration.js';

// Completion is intentionally derived from current profile + published schema.
// Never persist percentage/counts as independent mutable state.

export type ProfileCoreRequirement = 'avatar' | 'biography' | 'verification';

export type ProfileCompletionPolicy = Readonly<{
  requiredCore?: readonly ProfileCoreRequirement[];
}>;

export type ProfileCompletion = Readonly<{
  completedRequiredCount: number;
  totalRequiredCount: number;
  percentage: number;
  missingRequirementKeys: readonly string[];
}>;

function hasValue(value: ProfileFieldValue | undefined): boolean {
  return value !== undefined && value !== null && value !== '';
}

export function calculateProfileCompletion(
  profile: Profile,
  schema: ProfileSchemaConfiguration,
  policy: ProfileCompletionPolicy = {},
): ProfileCompletion {
  const missing: string[] = [];
  for (const field of schema.fields) {
    if (field.required && !hasValue(profile.fields[field.key])) missing.push(`field:${field.key}`);
  }
  for (const requirement of policy.requiredCore ?? []) {
    if (requirement === 'avatar' && (profile.avatar === null || profile.avatar.status !== 'active')) missing.push('core:avatar');
    if (requirement === 'biography' && (profile.biography === null || profile.biography.trim() === '')) missing.push('core:biography');
    if (requirement === 'verification' && profile.verificationStatus !== 'verified') missing.push('core:verification');
  }
  const totalRequiredCount = schema.fields.filter(field => field.required).length + (policy.requiredCore?.length ?? 0);
  const completedRequiredCount = totalRequiredCount - missing.length;
  return {
    completedRequiredCount,
    totalRequiredCount,
    percentage: totalRequiredCount === 0 ? 100 : Math.floor((completedRequiredCount / totalRequiredCount) * 100),
    missingRequirementKeys: missing,
  };
}
