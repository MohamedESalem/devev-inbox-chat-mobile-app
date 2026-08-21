import { DEVEV_INSTALLATION } from '@/config/devev';
import { sanitizeSettingsState } from '../settingsSlice';

describe('settingsSlice DEVEV sanitization', () => {
  it('overwrites legacy installation URLs while preserving user preferences', () => {
    const sanitized = sanitizeSettingsState({
      baseUrl: 'app.chatwoot.com',
      installationUrl: 'https://app.chatwoot.com/',
      webSocketUrl: 'wss://app.chatwoot.com/cable',
      localeValue: 'fr',
      pushToken: 'existing-token',
      uiFlags: {
        isSettingUrl: true,
        isUpdating: true,
        isLocaleSet: true,
      },
    });

    expect(sanitized).toMatchObject({
      ...DEVEV_INSTALLATION,
      localeValue: 'fr',
      pushToken: 'existing-token',
      uiFlags: {
        isSettingUrl: false,
        isUpdating: false,
        isLocaleSet: true,
      },
    });
  });
});
