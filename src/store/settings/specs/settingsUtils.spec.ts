import { DEVEV_INSTALLATION } from '@/config/devev';
import { checkValidUrl, getAllowedInstallationUrls } from '../settingsUtils';

describe('settingsUtils fixed-server policy', () => {
  it('accepts the canonical DEVEV server without a scheme', () => {
    expect(getAllowedInstallationUrls({ url: 'chat.inbox.devev.net' })).toEqual(DEVEV_INSTALLATION);
  });

  it('accepts the canonical DEVEV HTTPS URL', () => {
    expect(getAllowedInstallationUrls({ url: 'https://chat.inbox.devev.net' })).toEqual(
      DEVEV_INSTALLATION,
    );
  });

  it('rejects non-DEVEV hosts', () => {
    expect(() => getAllowedInstallationUrls({ url: 'https://example.invalid' })).toThrow(
      'DEVEV Inbox connects only to chat.inbox.devev.net.',
    );
  });

  it('rejects insecure DEVEV URLs', () => {
    expect(() => getAllowedInstallationUrls({ url: 'http://chat.inbox.devev.net' })).toThrow(
      'DEVEV Inbox connects only to chat.inbox.devev.net.',
    );
  });

  it('validates host-only input by applying an HTTPS scheme', () => {
    expect(checkValidUrl({ url: 'chat.inbox.devev.net' })).toBe(true);
  });
});
