import React from 'react';
import { render, screen } from '@testing-library/react';
import { i18n } from '@/i18n';
import Banner from '@/components/Banner';
import { I18nTestWrapper } from './utils/TestWrapper';

describe('BannerText', () => {
  beforeEach(() => {
    render(
      <I18nTestWrapper i18n={i18n}>
        <Banner />
      </I18nTestWrapper>,
    );
  });

  it('Renders both heading titles', () => {
    const headings = screen.getAllByRole('heading');
    const hasTitle1 = headings.some((h) => h.textContent?.toLowerCase().includes('navigate'));
    const hasTitle2 = headings.some((h) => h.textContent?.toLowerCase().includes('confidence'));

    expect(hasTitle1).toBe(true);
    expect(hasTitle2).toBe(true);
  });

  it('Renders the full paragraph text', () => {
    const paragraph = screen.getByText(
      (content) =>
        content.includes('Get personalized guidance') &&
        content.includes("Whether you're a tourist"),
    );
    expect(paragraph).toBeInTheDocument();
  });

  it('Renders the CTA button correctly', () => {
    const btn = screen.getByRole('button', { name: /try hellocity/i });
    expect(btn).toBeInTheDocument();
  });
});
