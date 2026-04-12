import { render, screen } from '@testing-library/react';
import LoginPage from '../../../app/login/page';
import * as React from 'react';

// 1. Mock the Server Actions
jest.mock('../../../app/login/actions', () => ({
  login: jest.fn(),
  signup: jest.fn(),
  signInWithGoogle: jest.fn(),
}));

// 2. Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => <div className={className}>{children}</div>,
  },
}));

// 3. Mock React's `use` hook to completely bypass the Suspense hang
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form and all action buttons properly', () => {
    // Return empty search params
    (React.use as jest.Mock).mockReturnValue({});
    
    render(<LoginPage searchParams={Promise.resolve({ message: '' })} />);

    expect(screen.getByRole('heading', { name: /welcome to mzansibuilds/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('does NOT render an error message by default', () => {
    (React.use as jest.Mock).mockReturnValue({});
    
    render(<LoginPage searchParams={Promise.resolve({ message: '' })} />);
    
    expect(screen.queryByText(/invalid login credentials/i)).not.toBeInTheDocument();
  });

  it('renders the error banner when a message is passed via searchParams', () => {
    // Inject our error message directly into the mocked `use` hook
    (React.use as jest.Mock).mockReturnValue({ message: 'Invalid login credentials' });
    
    render(<LoginPage searchParams={Promise.resolve({ message: 'Invalid login credentials' })} />);

    const errorBanner = screen.getByText('Invalid login credentials');
    expect(errorBanner).toBeInTheDocument();
    expect(errorBanner).toHaveClass('text-red-600'); 
  });
});