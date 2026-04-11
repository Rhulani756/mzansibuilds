import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

// We must mock AuthButton because it is an async Server Component.
// JSDOM (the test environment) cannot execute server-side Supabase logic.
jest.mock('../../components/AuthButton', () => {
  return function DummyAuthButton() {
    return <div data-testid="auth-button">Auth Button</div>;
  };
});

describe('Header Component', () => {
  it('renders the MzansiBuilds logo with the correct styling', () => {
    render(<Header />);
    const logoPart1 = screen.getByText(/Mzansi/i);
    const logoPart2 = screen.getByText(/Builds/i);
    
    expect(logoPart1).toBeInTheDocument();
    expect(logoPart2).toBeInTheDocument();
    expect(logoPart1.closest('a')).toHaveAttribute('href', '/');
  });

  it('contains navigation links for the user journey', () => {
    render(<Header />);
    
    const feedLink = screen.getByRole('link', { name: /Live Feed/i });
    const wallLink = screen.getByRole('link', { name: /Celebration Wall/i });
    
    expect(feedLink).toHaveAttribute('href', '/feed');
    expect(wallLink).toHaveAttribute('href', '/wall');
  });

  it('renders the New Project CTA as a link to the creation page', () => {
    render(<Header />);
    
    // CHANGED: We now look for 'link' because it's a Next.js Link, not a <button>
    const ctaLink = screen.getByRole('link', { name: /\+ New Project/i });
    
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/projects/new');
  });

  it('renders the AuthButton placeholder', () => {
    render(<Header />);
    expect(screen.getByTestId('auth-button')).toBeInTheDocument();
  });
});