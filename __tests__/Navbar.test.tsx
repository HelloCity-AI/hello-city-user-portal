import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavBar from '@/components/NavBar';
import React from 'react';
import { I18nTestWrapper } from './utils/TestWrapper';

describe('NavBar', () => {
  beforeEach(() => {
    // Clear localStorage to ensure a clean state for each test
    localStorage.clear();
  });

  it('renders the Logo and Nav buttons', () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    expect(screen.getByAltText('HelloCity Logo')).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const chatLink = screen.getByRole('link', { name: /Chat/i });
    expect(chatLink).toBeInTheDocument();
    // page component not implemented
    // expect(chatLink).toHaveAttribute('href', '/chat');

    const ctaLink = screen.getByRole('link', { name: /Try HelloCity/i });
    expect(ctaLink).toBeInTheDocument();
    // expect(ctaLink).toHaveAttribute('href', '/chat');
  });

  it('toggles language label between CN and EN', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('checkbox');

    expect(screen.getByText('EN')).toBeInTheDocument();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('CN')).toBeInTheDocument();
    });

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('EN')).toBeInTheDocument();
    });
  });

  it('has correct Tailwind classes on the outermost div', () => {
    const { container } = render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );
    const outerDiv = container.firstChild as HTMLElement;

    expect(outerDiv).toHaveClass(
      'fixed',
      'left-0',
      'top-0',
      'z-10',
      'flex',
      'w-[100vw]',
      'items-center',
      'justify-around',
      'pt-5'
    );
  });

  //NavBar Login Test incomplete
});