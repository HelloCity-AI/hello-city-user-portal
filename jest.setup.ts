import '@testing-library/jest-dom';
import { i18n } from '@/i18n';

i18n.load('en', {
  'banner.title1': 'Navigate your new city with',
  'banner.title2': 'Confidence',
  'banner.paragraph':
    "Get personalized guidance step by step checklists, and timeline planning for setting into any city. Whether you're a tourist, student or migrant",
  'banner.cta': 'Try HelloCity',
});
i18n.activate('en');
