/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
  orderBy: 'messageId',
  extractorParserOptions: {
    flow: false,
  },
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
};
