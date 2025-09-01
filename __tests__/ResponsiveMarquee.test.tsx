import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveMarquee from '@/compoundComponents/ResponsiveMarquee';
import { TestProviders } from '../utils/TestWrapper';

const mockUseIsMobile = jest.fn();
jest.mock('@/hooks/useIsMobile', () => ({
  __esModule: true,
  default: () => mockUseIsMobile(),
}));

const renderResponsiveMarquee = (props = {}) => {
  const defaultProps = {
    children: <div data-testid="main-content">Main Content</div>,
    duplicateChildren: <div data-testid="duplicate-content">Duplicate Content</div>,
    ...props,
  };

  return render(
    <TestProviders>
      <ResponsiveMarquee {...defaultProps} />
    </TestProviders>,
  );
};

describe('ResponsiveMarquee - Responsive marquee component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Renders main content correctly', () => {
      mockUseIsMobile.mockReturnValue(false);

      renderResponsiveMarquee();

      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('Shows duplicate content on desktop only', () => {
      mockUseIsMobile.mockReturnValue(false);

      renderResponsiveMarquee();

      expect(screen.getByTestId('duplicate-content')).toBeInTheDocument();
    });

    it('Hides duplicate content on mobile', () => {
      mockUseIsMobile.mockReturnValue(true);

      renderResponsiveMarquee();

      expect(screen.queryByTestId('duplicate-content')).not.toBeInTheDocument();
    });
  });

  describe('CSS Classes', () => {
    it('Applies mobile scroll classes when on mobile', () => {
      mockUseIsMobile.mockReturnValue(true);

      const { container } = renderResponsiveMarquee();
      const outerBox = container.firstChild;

      expect(outerBox).toHaveClass('overflow-x-scroll');
      expect(outerBox).not.toHaveClass('overflow-x-hidden');
    });

    it('Applies desktop marquee classes when on desktop', () => {
      mockUseIsMobile.mockReturnValue(false);

      const { container } = renderResponsiveMarquee();
      const outerBox = container.firstChild;
      const innerBox = outerBox?.firstChild;

      expect(outerBox).toHaveClass('overflow-x-hidden');
      expect(outerBox).not.toHaveClass('overflow-x-scroll');
      expect(innerBox).toHaveClass('animate-marquee', 'group-hover:paused');
    });
  });
});
