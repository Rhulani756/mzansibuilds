import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  it('renders the MzansiBuilds logo', () => {
    render(<Header />);
    const logo = screen.getByText(/Mzansi/i);
    expect(logo).toBeInTheDocument();
  });

  it('contains navigation links for the user journey', () => {
    render(<Header />);
    
    // Asserting that our core user journey routes exist
    const feedLink = screen.getByRole('link', { name: /Live Feed/i });
    const wallLink = screen.getByRole('link', { name: /Celebration Wall/i });
    
    expect(feedLink).toHaveAttribute('href', '/feed');
    expect(wallLink).toHaveAttribute('href', '/wall');
  });

  it('renders the New Project CTA button', () => {
    render(<Header />);
    const ctaButton = screen.getByRole('button', { name: /\+ New Project/i });
    expect(ctaButton).toBeInTheDocument();
  });
});