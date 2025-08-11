"use client";

import { I18nProvider as LinguiI18nProvider } from "@lingui/react";
import { i18n } from "../i18n";
import { ReactNode, useEffect, useState } from "react";
import { Messages } from "@lingui/core";

type Props = {
  children: ReactNode;
  initialLocale: string;
  initialMessages: { [key: string]: Messages };
};

export function I18nProvider({ children, initialLocale, initialMessages }: Props) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load messages for all locales
    i18n.load(initialMessages);
    // Activate the initial locale
    i18n.activate(initialLocale);
    // Mark as ready
    setIsReady(true);
  }, [initialLocale, initialMessages]);

  // Don't render children until i18n is properly initialized
  if (!isReady) {
    return null;
  }

  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
}
