# Android Notification Icon

These density-specific PNGs are generated from the official DEVEV mark in `assets/devev/logo-mark-source.png`.

The icon is a white-only foreground glyph on a transparent background for Android notification small-icon use.
`with-android-notification-icon.js` copies these files into the generated Android resource tree during EAS
prebuild and configures Firebase Cloud Messaging to use `@drawable/notification_icon`.

Regenerate the files only from an approved DEVEV mark. Do not use the launcher icon directly for Android
notification small icons.
