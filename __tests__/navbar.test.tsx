import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavBar from '@/components/NavBar';
import React from 'react';
import { I18nTestWrapper } from './utils/TestWrapper';

describe('NavBar', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('Renders the logo and navigation links', () => {
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

    const ctaLink = screen.getByRole('link', { name: /Try HelloCity/i });
    expect(ctaLink).toBeInTheDocument();
  });

  it('Toggles language label between CN and EN', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('switch');

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

  it('Applies correct Tailwind classes to the outermost div', () => {
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

  it('Displays English navigation items by default', () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Check Items')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Try HelloCity')).toBeInTheDocument();
  });

  it('Switches to Chinese and displays translated labels', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('switch');

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

  it('Switches back to English from Chinese', async () => {
    render(
      <I18nTestWrapper>
        <NavBar />
      </I18nTestWrapper>,
    );

    const toggle = screen.getByRole('switch');

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('首页')).toBeInTheDocument();
    });

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

  // Login test to be implemented
});
