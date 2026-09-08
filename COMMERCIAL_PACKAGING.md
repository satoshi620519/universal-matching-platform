# Commercial Packaging Guide

## Product summary

Universal Matching Platform is a commercially oriented source product for building category-specific matching services without redesigning the core platform.

It is designed for Web, iOS and Android deployments and supports buyer configuration through an Admin Quick Launch workflow.

## Included capabilities

- account and profile foundations
- configurable profile schemas
- multiple discovery and matching strategies
- mutual matching and messaging
- notifications
- safety, reporting and moderation foundations
- configurable verification and payment abstractions
- internationalization and geographic configuration
- administration and analytics foundations
- Web, Admin/API and mobile source-product components
- Quick Launch configuration and versioned publication

## Buyer customization paths

### Quick Launch
Change branding, regions, localization, categories, profile schema, features, terminology, matching rules, onboarding and legal/support settings without ordinary core-code edits.

### Advanced customization
Extend supported contracts for providers, policies, strategies, integrations and custom UI. See DEVELOPER_GUIDE.md and DEVELOPER_EXTENSIBILITY.md.

## What buyers are responsible for

The buyer/operator is responsible for deployment infrastructure, domain names, production secrets, legal policies, privacy notices, moderation operations, provider accounts, regulatory compliance, backups and operational monitoring.

## External and hosting costs

The source product does not include third-party hosting or provider charges. Depending on the deployment, buyers may incur costs for cloud infrastructure, databases, domains, email, push services, payment processing, identity verification and other integrations.

## Demo

Use the isolated workflow documented in DEMO_DEPLOYMENT_SPEC.md. Demo reset is scoped to fictional baseline data and is not a production maintenance tool.

## Release blocker

A reviewed commercial LICENSE must be selected before marketplace source distribution. See LICENSE_DECISION_REQUIRED.md.


## Verified screenshot capture checklist

No repository screenshot assets or release assets are currently treated as verified marketing evidence. Capture these only from a running build of the current release candidate:

1. Web discovery/profile experience
2. Mutual-match result
3. Member conversation
4. Admin Quick Launch overview
5. Branding configuration
6. Region/localization configuration
7. Matching/profile configuration
8. Review and Publish
9. Published configuration history
10. Mobile representative flow, if the mobile build has passed its acceptance checklist

For each asset, record the commit/version, capture date, viewport/device, and whether fictional demo data was used. Do not use mockups as evidence of implemented functionality without labeling them as illustrative.
