# DEVEV Inbox Mobile App

DEVEV Inbox is DEVEV's white-labeled mobile client for the self-hosted Chatwoot server at
`https://chat.inbox.devev.net`.

This fork is intentionally kept close to the upstream Chatwoot mobile application so future upstream updates can
be merged with minimal conflict. Internal Chatwoot API names, dependency names, protocol headers, and license
attribution are preserved where they are required for compatibility.

## Mobile Stack

- Expo SDK: `~57.0.7`
- React Native: `0.86.0`
- Package manager: `pnpm@10.11.0`
- App version: `4.9.0`
- Android application ID: `net.devev.inbox`
- iOS bundle identifier: `net.devev.inbox`
- Expo slug: `devev-inbox`

## Validation And Builds

Do not install mobile SDKs or run native builds locally for this fork.

Use the manual GitHub Actions workflow `DEVEV Mobile Cloud Validation` to run dependency installation, linting,
type checking, tests, branding audits, secret audits, Expo config resolution, and optional Expo EAS cloud builds.

Required build setup and operational notes are documented in
[`docs/devev-inbox-maintenance.md`](docs/devev-inbox-maintenance.md).

## Upstream Attribution

This repository is based on the official Chatwoot mobile application. Chatwoot remains copyright Chatwoot Inc.
and is released under the MIT License. See [`LICENSE`](LICENSE).
