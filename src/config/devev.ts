export const DEVEV_CONFIG = {
  PRODUCT_NAME: 'DEVEV Inbox',
  BRAND_NAME: 'DEVEV',
  INSTALLATION_NAME: 'DEVEV Inbox',
  BRAND_URL: 'https://inbox.devev.net',
  TERMS_URL: 'https://inbox.devev.net/terms-of-service',
  PRIVACY_URL: 'https://inbox.devev.net/privacy-policy',
  SUPPORT_URL: 'https://inbox.devev.net',
  PRIMARY_COLOR: '#5324ca',
  SERVER_URL: 'https://chat.inbox.devev.net',
  SERVER_HOST: 'chat.inbox.devev.net',
  WEBSOCKET_URL: 'wss://chat.inbox.devev.net/cable',
  URL_SCHEME: 'devevinbox',
  SSO_CALLBACK_PATH: 'auth/saml',
  PACKAGE_ID: 'net.devev.inbox',
  EXPO_SLUG: 'devev-inbox',
} as const;

export const DEVEV_SSO_CALLBACK_URL = `${DEVEV_CONFIG.URL_SCHEME}://${DEVEV_CONFIG.SSO_CALLBACK_PATH}`;

export const DEVEV_INSTALLATION = {
  baseUrl: DEVEV_CONFIG.SERVER_HOST,
  installationUrl: `${DEVEV_CONFIG.SERVER_URL}/`,
  webSocketUrl: DEVEV_CONFIG.WEBSOCKET_URL,
};

const HTTPS_SCHEME = 'https:';

export const normalizeUrlWithScheme = (url: string): string => {
  const trimmedUrl = url.trim();
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
};

export const parseInstallationUrl = (url: string): URL | null => {
  try {
    return new URL(normalizeUrlWithScheme(url));
  } catch {
    return null;
  }
};

export const isDevevInstallationUrl = (url: string): boolean => {
  const parsedUrl = parseInstallationUrl(url);
  return Boolean(
    parsedUrl &&
      parsedUrl.protocol === HTTPS_SCHEME &&
      parsedUrl.host.toLowerCase() === DEVEV_CONFIG.SERVER_HOST,
  );
};

export const isDevevDeepLink = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const isSsoCallback =
      parsedUrl.protocol === `${DEVEV_CONFIG.URL_SCHEME}:` &&
      `${parsedUrl.host}${parsedUrl.pathname}` === DEVEV_CONFIG.SSO_CALLBACK_PATH;

    return (
      (parsedUrl.protocol === HTTPS_SCHEME &&
        parsedUrl.host.toLowerCase() === DEVEV_CONFIG.SERVER_HOST) ||
      isSsoCallback
    );
  } catch {
    return false;
  }
};

export const isSsoEnabled = (): boolean => process.env.EXPO_PUBLIC_DEVEV_ENABLE_SSO === 'true';

export const isServerOverrideEnabled = (): boolean =>
  typeof __DEV__ !== 'undefined' &&
  __DEV__ &&
  process.env.EXPO_PUBLIC_DEVEV_ALLOW_SERVER_OVERRIDE === 'true';
