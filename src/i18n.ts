import { i18n } from "@lingui/core";
import { en, zh } from "make-plural/plurals";

// Load pluralization rules
i18n.loadLocaleData({
  en: { plurals: en },
  zh: { plurals: zh },
});

// Note: This file is for client-side use only
// Server-side i18n is handled by appRouterI18n.ts

export { i18n };
