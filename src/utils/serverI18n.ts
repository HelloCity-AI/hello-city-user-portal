import { getAllMessages } from '@/appRouterI18n';
import React from 'react';

/**
 * Server-side translation utility function
 * Used to get translated text in server components
 */
export async function getServerTranslation(locale: string) {
  const messages = await getAllMessages(locale);

  /**
   * Translation function, similar to client-side i18n._() method
   * @param id Translation key
   * @param fallback Fallback text (optional)
   * @returns Translated text
   */
  const t = (id: string, fallback?: string): string => {
    const message = messages[id];
    if (typeof message === 'string') {
      return message;
    }
    // Handle array format from Lingui
    if (Array.isArray(message) && message.length > 0) {
      const firstElement = message[0];
      if (typeof firstElement === 'string') {
        return firstElement;
      }
    }
    return fallback || id;
  };

  return { t, messages, locale };
}

/**
 * Server-side translation hook (for server components)
 * @param locale Language code
 * @param id Translation key
 * @param fallback Fallback text
 * @returns Translated text
 */
export async function serverTrans(locale: string, id: string, fallback?: string): Promise<string> {
  const { t } = await getServerTranslation(locale);
  return t(id, fallback);
}

/**
 * Batch get translation texts (for server components)
 * @param locale Language code
 * @param translations Mapping of translation keys and fallback texts
 * @returns Mapping of translated texts
 */
export async function getServerTranslations(
  locale: string,
  translations: Record<string, string>,
): Promise<Record<string, string>> {
  const { t } = await getServerTranslation(locale);
  const result: Record<string, string> = {};

  for (const [key, fallback] of Object.entries(translations)) {
    result[key] = t(key, fallback);
  }

  return result;
}

/**
 * Server component translation Props type
 */
export interface ServerTranslationProps {
  locale: string;
}

/**
 * Higher-order function to create server translation component
 * @param Component Component to be wrapped
 * @returns Wrapped component
 */
export function withServerTranslation<T extends ServerTranslationProps>(
  Component: React.ComponentType<T & { t: (id: string, fallback?: string) => string }>,
) {
  return async function ServerTranslatedComponent(props: T) {
    const { t } = await getServerTranslation(props.locale);
    return React.createElement(Component, { ...props, t });
  };
}
