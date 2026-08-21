import { showToast } from '@/utils/toastUtils';
import I18n from '@/i18n';
import {
  DEVEV_CONFIG,
  DEVEV_INSTALLATION,
  isDevevInstallationUrl,
  isServerOverrideEnabled,
  normalizeUrlWithScheme,
  parseInstallationUrl,
} from '@/config/devev';

export const handleApiError = (error: unknown, customErrorMsg?: string) => {
  const errorMessage = error instanceof Error ? error.message : I18n.t('CONFIGURE_URL.ERROR');
  showToast({ message: errorMessage });
  return errorMessage;
};

export const extractDomain = ({ url }: { url: string }) => {
  const isValidUrl = checkValidUrl({ url });

  if (!isValidUrl) {
    return url;
  }
  const domain = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    domain != null &&
    domain.length > 2 &&
    typeof domain[2] === 'string' &&
    domain[2].length > 0
  ) {
    return domain[2];
  }
  return url;
};

export const checkValidUrl = ({ url }: { url: string }) => {
  try {
    return Boolean(new URL(normalizeUrlWithScheme(url)));
  } catch {
    return false;
  }
};

export const getInstallationUrls = ({ url }: { url: string }) => {
  const parsedUrl = parseInstallationUrl(url);
  if (!parsedUrl) {
    throw new Error(I18n.t('CONFIGURE_URL.ERROR'));
  }

  const normalizedInstallationUrl = `${parsedUrl.protocol}//${parsedUrl.host}/`;
  const normalizedWebSocketProtocol = parsedUrl.protocol === 'https:' ? 'wss' : 'ws';

  return {
    installationUrl: normalizedInstallationUrl,
    webSocketUrl: `${normalizedWebSocketProtocol}://${parsedUrl.host}/cable`,
    baseUrl: parsedUrl.host,
  };
};

export const getAllowedInstallationUrls = ({ url }: { url: string }) => {
  if (isServerOverrideEnabled()) {
    return getInstallationUrls({ url });
  }

  if (!isDevevInstallationUrl(url)) {
    throw new Error(
      `${DEVEV_CONFIG.PRODUCT_NAME} connects only to ${DEVEV_CONFIG.SERVER_HOST}.`,
    );
  }

  return DEVEV_INSTALLATION;
};

export const sanitizeInstallationUrls = () => DEVEV_INSTALLATION;
