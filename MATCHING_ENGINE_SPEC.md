# MATCHING ENGINE SPECIFICATION

## Purpose
Phase 9 defines a configurable matching engine without duplicating existing discovery, geographic filtering, distance constraints, or mutual-interest transitions.

## Existing foundations reused
- DiscoveryQuery and DiscoveryProfileRepository
- GeographicScope and optional DistanceConstraint
- Discovery eligibility and safety/block exclusions
- MatchStrategy extension interface
- MatchingRulesConfiguration purchaser-facing rule metadata
- Existing mutual match transition and concurrency guarantees

## Phase 9 engine boundary
The engine must add only missing capabilities:
1. Structured preferences
2. Candidate filtering
3. Search criteria
4. Deterministic sorting
5. Compatibility evaluation and scoring
6. Replaceable algorithms

## Algorithm contract
Every algorithm receives a subject profile, candidate profile, and normalized rule set.
It returns a deterministic result containing:
- eligibility
- score (0..100)
- strategy key
- optional reasons

Algorithms must not persist likes, matches, messages, or mutate profiles.

## Initial implementation order
1. Domain compatibility/scoring contract
2. Rule-based weighted algorithm
3. Deterministic sorting policy
4. Preference/filter projection into discovery
5. API boundary
6. Regression tests

## Extensibility
Algorithms are selected by stable key. Future implementations may include:
- rule-based
- weighted scoring
- recommendation model
- AI-assisted compatibility

No future algorithm may bypass existing safety, block, privacy, geographic, or distance constraints.
