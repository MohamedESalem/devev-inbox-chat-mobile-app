import { isDevevDeepLink, isDevevInstallationUrl } from '../devev';

describe('DEVEV configuration guards', () => {
  it('accepts the production HTTPS host', () => {
    expect(isDevevInstallationUrl('https://chat.inbox.devev.net')).toBe(true);
    expect(
      isDevevDeepLink('https://chat.inbox.devev.net/app/accounts/1/conversations/2'),
    ).toBe(true);
  });

  it('rejects unsupported hosts and schemes', () => {
    expect(isDevevInstallationUrl('https://example.invalid')).toBe(false);
    expect(isDevevDeepLink('https://example.invalid/app/accounts/1/conversations/2')).toBe(false);
    expect(isDevevDeepLink('chatwootapp://auth/saml')).toBe(false);
  });

  it('accepts only the DEVEV SSO callback custom scheme path', () => {
    expect(isDevevDeepLink('devevinbox://auth/saml')).toBe(true);
    expect(isDevevDeepLink('devevinbox://other/path')).toBe(false);
  });
});
