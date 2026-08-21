import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { DEVEV_CONFIG } from '@/config/devev';

export const selectSettings = (state: RootState) => state.settings;

export const selectInstallationUrl = createSelector(
  selectSettings,
  settings => settings.installationUrl,
);

export const selectLocale = createSelector(selectSettings, settings =>
  settings.localeValue === 'zh' ? 'zh_CN' : settings.localeValue,
);

export const selectIsLocaleSet = createSelector(
  selectSettings,
  settings => settings.uiFlags.isLocaleSet,
);

export const selectIsSettingUrl = createSelector(
  selectSettings,
  settings => settings.uiFlags.isSettingUrl,
);

export const selectBaseUrl = createSelector(selectSettings, settings => settings.baseUrl);

export const selectNotificationSettings = createSelector(
  selectSettings,
  settings => settings.notificationSettings,
);

export const selectWebSocketUrl = createSelector(selectSettings, settings => settings.webSocketUrl);

export const selectTheme = createSelector(selectSettings, settings => settings.theme);

export const selectIsDevevServer = createSelector(selectSettings, settings =>
  settings.installationUrl.includes(DEVEV_CONFIG.SERVER_HOST),
);

export const selectChatwootVersion = createSelector(selectSettings, settings => settings.version);

export const selectPushToken = createSelector(selectSettings, settings => settings.pushToken);
