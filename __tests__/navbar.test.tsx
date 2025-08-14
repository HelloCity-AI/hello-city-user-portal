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
      'w-[100vw]',
      'pt-5',
      'top-0',
      'left-0',
      'flex',
      'justify-around',
      'items-center',
      'z-10',
    );
  });

  it('displays English navigation items by default', () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    // It would display English navigation items by default
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Check Items')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Try HelloCity')).toBeInTheDocument();
  });

  it('switches to Chinese and updates translations', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('checkbox');

    // Switch to Chinese
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('首页')).toBeInTheDocument();
      expect(screen.getByText('聊天')).toBeInTheDocument();
      expect(screen.getByText('常见问题')).toBeInTheDocument();
      expect(screen.getByText('检查项目')).toBeInTheDocument();
      expect(screen.getByText('登录')).toBeInTheDocument();
      expect(screen.getByText('试用 HelloCity')).toBeInTheDocument();
    });
  });

  it('switches back to English from Chinese', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('checkbox');

    // Switch to Chinese
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('首页')).toBeInTheDocument();
    });

    // Switch back to English
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
      expect(screen.getByText('Check Items')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Try HelloCity')).toBeInTheDocument();
    });
  });

  //NavBar Login Test incomplete
});
