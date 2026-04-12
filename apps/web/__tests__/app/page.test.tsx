import { render, screen } from '@testing-library/react';
import LandingPage from '../../app/page'; // Adjust the path to where your component lives
import * as React from 'react';

// 1. Mock framer-motion to bypass animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(function MockDiv({ children, className, ...props }: { children: React.ReactNode; className?: string }, ref: React.Ref<HTMLDivElement>) {
      return <div ref={ref} className={className} {...props}>{children}</div>;
    }),
    h1: React.forwardRef(function MockH1({ children, className, ...props }: { children: React.ReactNode; className?: string }, ref: React.Ref<HTMLHeadingElement>) {
      return <h1 ref={ref} className={className} {...props}>{children}</h1>;
    }),
    h2: React.forwardRef(function MockH2({ children, className, ...props }: { children: React.ReactNode; className?: string }, ref: React.Ref<HTMLHeadingElement>) {
      return <h2 ref={ref} className={className} {...props}>{children}</h2>;
    }),
    p: React.forwardRef(function MockP({ children, className, ...props }: { children: React.ReactNode; className?: string }, ref: React.Ref<HTMLParagraphElement>) {
      return <p ref={ref} className={className} {...props}>{children}</p>;
    }),
  },
}));

describe('LandingPage Component', () => {
  beforeEach(() => {
    // 2. Use fake timers so the useTypewriter hook doesn't leak memory or cause warnings
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the Hero section correctly', () => {
    render(<LandingPage />);

    expect(screen.getByText(/MZANSIBUILDS ONLINE DEV CO-LAB/i)).toBeInTheDocument();
    expect(screen.getByText(/Ship with Purpose!/i)).toBeInTheDocument();
    
    // FIX: Use a function matcher to find text split across spans
    expect(screen.getByRole('link', { name: /Start a Project/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Live Feed/i })).toBeInTheDocument();
  });

  it('renders all feature cards correctly', () => {
    render(<LandingPage />);

    // Check section headers
    expect(screen.getByText('// What you get')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Everything you need to ship/i })).toBeInTheDocument();

    // Check the three specific feature cards
    expect(screen.getByText('Live Feed')).toBeInTheDocument();
    expect(screen.getByText(/Watch builds happen in real time/i)).toBeInTheDocument();

    expect(screen.getByText('Celebration Wall')).toBeInTheDocument();
    expect(screen.getByText(/Earn your spot on the wall/i)).toBeInTheDocument();

    expect(screen.getByText('Your Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Track every milestone, manage your projects/i)).toBeInTheDocument();
  });

  it('renders the Bottom CTA section correctly', () => {
    render(<LandingPage />);

    // FIX: Use a more flexible name matcher for the heading with nested spans
    expect(screen.getByRole('heading', { name: /Ready to build/i })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Get Started — it's free/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View the Wall/i })).toBeInTheDocument();
  });
});