import { render, screen } from '@testing-library/react';
import Banner from '@/components/Banner';

describe('BannerText', () => {
  beforeEach(() => {
    render(<Banner />);
  });
  it('renders the correct text with line breaks', () => {
    expect(
      screen.getByText(/Get personalized guidance step by step checklists/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/planning for setting into any city/i)).toBeInTheDocument();
    expect(screen.getByText(/Whether you're a tourist, student or/i)).toBeInTheDocument();
    expect(screen.getByText(/migrant/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Try HelloCity/i })).toBeInTheDocument();
  });

  it('has the CTA button with proper text and spacing', () => {
    const button = screen.getByRole('button', { name: /Try hellocity/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ marginTop: '6px' });
  });
});
