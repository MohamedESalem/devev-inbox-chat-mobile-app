# DEVEV Inbox Mobile Maintainer Guide

This repository is a white-labeled fork of the upstream Chatwoot mobile app. It is configured as
`DEVEV Inbox`, a dedicated mobile client for `https://chat.inbox.devev.net`.

## What Changed

- App identity is DEVEV-owned: display name `DEVEV Inbox`, Android package `net.devev.inbox`, iOS bundle
  identifier `net.devev.inbox`, Expo slug `devev-inbox`, and custom scheme `devevinbox`.
- Runtime server selection is fixed to `https://chat.inbox.devev.net` and websocket
  `wss://chat.inbox.devev.net/cable`.
- The authenticated default tab is `Conversations`; the `Inbox` tab remains available.
- User-visible branding, app icons, splash image, auth logo, support links, and primary UI color were changed to
  DEVEV values.
- Cloud validation/builds are handled by the manual GitHub Actions workflow
  `DEVEV Mobile Cloud Validation`.

## Preserved Chatwoot References

The following references are intentionally preserved because they are compatibility or legal requirements:

- `@chatwoot/*` dependency names in `package.json` and `pnpm-lock.yaml`.
- `X-Chatwoot-*` API headers expected by the Chatwoot backend.
- Internal action, selector, and service names such as `getChatwootVersion`.
- Dashboard app protocol strings such as `chatwoot-dashboard-app:fetch-info`.
- Upstream comments, mock/story data, and tests that model upstream Chatwoot payloads.
- `LICENSE` and upstream copyright/attribution text.
- `SECURITY.md`, which remains the upstream security policy reference unless DEVEV replaces it.

## Configuration Locations

- Product/server/brand constants: `src/config/devev.ts`.
- Expo app identity and deep links: `app.config.ts`.
- EAS profiles: `eas.json`.
- Public env examples: `.env.example`.
- Theme brand token: `src/theme/tailwind.config.ts`.
- App icon/splash sources: `assets/devev/`.
- Generated app assets: `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png`,
  `src/assets/images/logo.png`, and `src/assets/local/logo.png`.

## Updating Logos Later

Replace the official source files in `assets/devev/`, then regenerate the generated app assets from those official
sources. Keep these rules:

- `assets/icon.png` must be a 1024x1024 opaque PNG for iOS/app-store compatibility.
- `assets/adaptive-icon.png` should be a transparent Android adaptive-icon foreground inside the safe zone.
- `assets/splash.png` should preserve the logo aspect ratio and match the Expo splash background.
- Auth/header logos should not stretch, crop, recolor, or distort the official mark.
- The Android notification small icon source is `assets/android-notification-icon/`: white-only/monochrome on
  transparent background, wired into EAS prebuild by `with-android-notification-icon.js`.

## Updating Colors Later

The official primary color is `#5324ca`. Update `DEVEV_CONFIG.PRIMARY_COLOR` and the `brand` scale in
`src/theme/tailwind.config.ts`. Keep status/semantic colors such as success, warning, destructive, disabled,
conversation status, priority, and channel colors unless DEVEV explicitly approves replacements.

## Syncing Upstream Chatwoot

Keep DEVEV-specific changes narrow:

- Pull upstream Chatwoot changes into a separate branch and resolve conflicts around `app.config.ts`, settings,
  auth, navigation, theme, assets, and docs first.
- Do not rename internal Chatwoot API concepts unless they become user-visible.
- Re-run the branding and secret audits after every upstream merge.
- Re-check that persisted settings still sanitize to `https://chat.inbox.devev.net/`.

## Firebase Setup

Create a DEVEV-owned Firebase project. Do not use Chatwoot's Firebase project.

Android mobile app:

- Register Android package `net.devev.inbox`.
- Download `google-services.json`.
- Do not commit it. Inject it in CI from `ANDROID_GOOGLE_SERVICES_JSON_B64` or configure it as an EAS secret/file.

iOS mobile app:

- Register iOS bundle identifier `net.devev.inbox`.
- Download `GoogleService-Info.plist`.
- Do not commit it. Inject it in CI from `IOS_GOOGLE_SERVICE_INFO_PLIST_B64` or configure it as an EAS secret/file.

Server-side Chatwoot:

- Generate a Firebase service-account JSON for the DEVEV Firebase project.
- Store that private JSON only in the self-hosted Chatwoot server/Super Admin configuration.
- Configure `FIREBASE_PROJECT_ID` and `FIREBASE_CREDENTIALS` for direct Firebase push notifications.
- Configure `ANDROID_BUNDLE_ID=net.devev.inbox` and add the Android app signing certificate SHA-256 once EAS
  signing credentials exist.

Public Firebase client files belong in the mobile build. Private Firebase service-account credentials belong only on
the Chatwoot server.

## GitHub And Expo Secrets

GitHub Actions secrets:

- `EXPO_TOKEN`: Expo access token for non-interactive EAS builds.
- `ANDROID_GOOGLE_SERVICES_JSON_B64`: base64-encoded `google-services.json`.
- `IOS_GOOGLE_SERVICE_INFO_PLIST_B64`: base64-encoded `GoogleService-Info.plist`.

GitHub Actions variables:

- `EXPO_OWNER`: DEVEV Expo account or organization owner.
- `EXPO_PROJECT_ID`: DEVEV Expo project ID.
- `EXPO_PUBLIC_DEVEV_ENABLE_SSO`: set to `true` only after the server callback is confirmed.

Optional DEVEV-owned values can be configured in GitHub variables or EAS secrets:

- `EXPO_PUBLIC_DEVEV_SUPPORT_WEBSITE_TOKEN`
- `EXPO_PUBLIC_DEVEV_SUPPORT_BASE_URL`
- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_SENTRY_PROJECT_NAME`
- `EXPO_PUBLIC_SENTRY_ORG_NAME`
- `EXPO_PUBLIC_JUNE_SDK_KEY`

Do not store Apple credentials, Google Play credentials, Firebase service-account JSON, signing keys, or Expo tokens
in source files.

## Triggering Cloud Builds

Open GitHub Actions, choose `DEVEV Mobile Cloud Validation`, then run the workflow manually with one target:

- `validate-only`: install dependencies, lint, type check, test, audit, and resolve Expo config.
- `android-preview`: validation plus internal Android preview APK build.
- `android-production`: validation plus Android production build.
- `ios-preview`: validation plus internal iOS build readiness.
- `ios-production`: validation plus iOS production build.

The workflow uses EAS cloud builds with `--no-wait` and never submits to an app store.

## Android Preview APK Testing

After an `android-preview` EAS build finishes:

1. Open the Expo/EAS build page from the GitHub Actions log.
2. Download the APK from EAS.
3. Install it on a physical Android phone.
4. Log in with a DEVEV Inbox agent account.
5. Confirm the app opens Conversations by default.
6. Confirm notification taps open the correct conversation.
7. Confirm logout and relogin still use `chat.inbox.devev.net`.

Push notifications must be tested on physical devices. Simulators/emulators do not cover every push-notification
behavior.

## Before Store Submission

- Confirm DEVEV owns the package IDs, Expo project, Firebase project, Apple bundle ID, Google Play app, and signing
  credentials.
- Add official store screenshots, store descriptions, privacy labels, and support contact details.
- Verify Android App Links and iOS Universal Links for `chat.inbox.devev.net`.
- Test physical-device push notifications on Android and iOS.
- Confirm SSO only if `devevinbox://auth/saml` is configured and tested server-side.
- Run production EAS builds and review artifacts before any submission.
- Do not submit automatically from this repository unless a separate explicit approval is given.

## Troubleshooting

- EAS cannot find the project: set `EXPO_OWNER`, `EXPO_PROJECT_ID`, and `EXPO_TOKEN`, then initialize the project in
  Expo if it does not exist yet.
- Android build fails on Firebase config: ensure `ANDROID_GOOGLE_SERVICES_JSON_B64` decodes to a valid
  `google-services.json` for package `net.devev.inbox`.
- iOS build fails on Firebase config: ensure `IOS_GOOGLE_SERVICE_INFO_PLIST_B64` decodes to a valid
  `GoogleService-Info.plist` for bundle `net.devev.inbox`.
- Push token registers but no notifications arrive: verify Chatwoot Super Admin has the DEVEV Firebase project ID
  and service-account credentials, and confirm the mobile app package IDs match Firebase.
- Notification tap does not open a conversation: confirm the notification payload includes account and conversation
  data and that the generated link uses `https://chat.inbox.devev.net/app/accounts/.../conversations/...`.
- Deep links do not open the app: verify Android App Links/Universal Links, associated domains, assetlinks/AASA
  server files, package ID, and signing SHA-256.
- SSO does not return to the app: keep `EXPO_PUBLIC_DEVEV_ENABLE_SSO=false` until the server redirects to
  `devevinbox://auth/saml` with `email` and `sso_auth_token` parameters.
- Branding audit fails: remove old public identifiers such as `app.chatwoot.com`, `chatwootapp`, or
  `com.chatwoot.app` from user-visible surfaces unless the reference is intentionally internal and allowlisted.
- Secret audit fails: remove tracked credentials or signing files and move them to GitHub/EAS/Chatwoot server
  secrets.
