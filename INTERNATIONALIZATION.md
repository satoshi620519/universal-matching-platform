# INTERNATIONALIZATION

## Purpose
Define the domain and product boundaries for global geographic and locale support before Phase 8 implementation.

## Phase 8 scope
- country selection
- region/state/province hierarchy
- city/locality support
- locale support
- timezone support
- language support
- distance-based matching where enabled
- country/region filtering
- configurable location precision

## Ownership boundaries
- `Profile.geographicScope` owns the profile's matching/discovery geographic scope.
- Authentication and identity providers do not own profile location presentation.
- Locale, language, and timezone are user/account preferences and must remain separate from geographic scope.
- Discovery/matching may consume normalized geographic data, but must not expose precise location merely because it is available internally.
- Country/region reference data is configuration/reference data, not profile field values.

## Privacy baseline
1. Precise coordinates are never public by default.
2. Public profile projections expose only the configured geographic precision.
3. A deployment may choose country, region, locality, or distance presentation, subject to its privacy policy.
4. Internal coordinates, when enabled for distance matching, remain separate from public profile presentation.
5. Distance calculations must not require returning a user's precise coordinates to another user.

## Normalization
- Country identifiers use ISO 3166-1 alpha-2 codes where a country code is required.
- Region identifiers are deployment/reference-data identifiers and are not assumed globally uniform.
- Locality identifiers are reference-data identifiers and are not treated as free-form public coordinates.
- Locale and language identifiers follow established BCP 47-style tags where applicable.
- Timezones use IANA timezone identifiers.

## Configurability
A deployment must be able to configure:
- enabled countries
- enabled regions/localities where reference data is available
- default locale
- supported locales/languages
- supported timezones
- public location precision
- whether distance matching is enabled
- distance units/display policy

No dating-specific geographic assumptions may be embedded in the domain.

## Distance matching boundary
Distance matching is optional. When enabled, the system should use an internal normalized location representation and a replaceable distance calculation policy. The matching engine consumes the resulting distance/constraint result; profile projection remains responsible for public location visibility.

## Phase 8 implementation order
1. Reference contracts for country/region/locality and locale/timezone/language.
2. Normalize and validate geographic scope at domain boundaries.
3. Add optional private location data needed for distance matching without coupling it to public projection.
4. Add configurable location precision policy.
5. Add discovery filtering by country/region and optional distance constraints.
6. Add persistence and migrations.
7. Add service/API integration.
8. Add regression and privacy-boundary tests.
9. Verify CI before advancing to Phase 9.

## Acceptance criteria
- Geographic identifiers are normalized and validated.
- Country/region/locality hierarchy is representable without assuming one global region-code scheme.
- Locale, language, and timezone are independently configurable.
- Precise location is not exposed by default.
- Distance matching can be enabled without changing public profile shape.
- Country/region filtering is available to discovery when configured.
- Location precision is controlled by policy rather than hard-coded presentation logic.
- Tests cover privacy boundaries and configuration behavior.
