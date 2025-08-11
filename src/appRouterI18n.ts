import { Messages } from '@lingui/core';

// Import the actual compiled message catalogs
const catalogs: Record<string, () => Promise<{ messages: Messages }>> = {
  en: () => import('./locales/en/messages.mjs'),
  zh: () => import('./locales/zh/messages.mjs'),
};

// Cache for loaded messages
const loadedMessages: Record<string, Messages> = {};

export async function getAllMessages(locale: string): Promise<Messages> {
  // Return cached messages if already loaded
  if (loadedMessages[locale]) {
    return loadedMessages[locale];
  }

  try {
    // Load messages from the compiled catalog
    const catalog = await catalogs[locale]?.();
    if (catalog?.messages) {
      loadedMessages[locale] = catalog.messages;
      return catalog.messages;
    }
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}:`, error);
  }

  // Fallback to English if locale not found
  if (locale !== 'en') {
    return getAllMessages('en');
  }

  // Ultimate fallback - empty messages
  return {};
}
