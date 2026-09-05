# Security Policy

## Reporting a vulnerability

Do not publish suspected security vulnerabilities in public issues or marketplace reviews. The marketplace release package must provide a private security contact controlled by the deployment owner before public launch.

When reporting, include:
- affected version or commit
- reproduction steps
- impact assessment
- any relevant logs with secrets removed

## Deployment responsibilities

This repository is source software. Each deployment owner is responsible for production secrets, TLS, infrastructure access, database backups, monitoring and incident response.

Before release:
- remove development and demo credentials
- keep secrets outside source control
- use unique production database credentials
- restrict administrative access
- configure HTTPS/TLS
- apply supported dependency and platform updates
- test backup and restore procedures

## Security boundaries

Purchaser-facing configuration must not be treated as authorization. Presentation settings such as feature visibility and terminology labels do not grant runtime privileges or alter stable internal identifiers.

## Release handling

A confirmed vulnerability should be assessed, fixed in a new release, documented in CHANGELOG.md at an appropriate level, and distributed with clear upgrade guidance when the affected release is known.
