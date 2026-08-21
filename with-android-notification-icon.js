const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = 'with-android-notification-icon';
const ICON_RESOURCE_NAME = 'notification_icon';
const COLOR_RESOURCE_NAME = 'devev_notification_color';
const NOTIFICATION_COLOR = '#5324ca';

const DENSITY_FILES = {
  mdpi: 'notification-icon-mdpi.png',
  hdpi: 'notification-icon-hdpi.png',
  xhdpi: 'notification-icon-xhdpi.png',
  xxhdpi: 'notification-icon-xxhdpi.png',
  xxxhdpi: 'notification-icon-xxxhdpi.png',
};

const upsertMetaData = (application, name, attrs) => {
  application['meta-data'] ??= [];
  const metaData = application['meta-data'];
  const existing = metaData.find(item => item.$?.['android:name'] === name);
  const nextAttrs = {
    'android:name': name,
    ...attrs,
  };

  if (existing) {
    existing.$ = { ...existing.$, ...nextAttrs };
    return;
  }

  metaData.push({ $: nextAttrs });
};

const withAndroidNotificationManifest = config =>
  withAndroidManifest(config, cfg => {
    cfg.modResults.manifest.$ = {
      ...cfg.modResults.manifest.$,
      'xmlns:tools': 'http://schemas.android.com/tools',
    };

    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    upsertMetaData(application, 'com.google.firebase.messaging.default_notification_icon', {
      'android:resource': `@drawable/${ICON_RESOURCE_NAME}`,
    });
    upsertMetaData(application, 'com.google.firebase.messaging.default_notification_color', {
      'android:resource': `@color/${COLOR_RESOURCE_NAME}`,
      'tools:replace': 'android:resource',
    });

    return cfg;
  });

const withAndroidNotificationResources = config =>
  withDangerousMod(config, [
    'android',
    cfg => {
      const projectRoot = cfg.modRequest.projectRoot;
      const resRoot = path.join(cfg.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
      const sourceRoot = path.join(projectRoot, 'assets', 'android-notification-icon');

      for (const [density, fileName] of Object.entries(DENSITY_FILES)) {
        const source = path.join(sourceRoot, fileName);
        if (!fs.existsSync(source)) {
          throw new Error(`${MARKER}: missing ${source}`);
        }

        const targetDir = path.join(resRoot, `drawable-${density}`);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(source, path.join(targetDir, `${ICON_RESOURCE_NAME}.png`));
      }

      const valuesDir = path.join(resRoot, 'values');
      fs.mkdirSync(valuesDir, { recursive: true });
      fs.writeFileSync(
        path.join(valuesDir, `${COLOR_RESOURCE_NAME}.xml`),
        `<resources>\n  <color name="${COLOR_RESOURCE_NAME}">${NOTIFICATION_COLOR}</color>\n</resources>\n`,
        'utf8',
      );

      return cfg;
    },
  ]);

const withAndroidNotificationIcon = config => {
  config = withAndroidNotificationManifest(config);
  config = withAndroidNotificationResources(config);
  return config;
};

module.exports = createRunOncePlugin(withAndroidNotificationIcon, MARKER, '1.0.0');
