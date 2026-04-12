import { render, screen } from '@testing-library/react';
import AuthButton from '../../components/AuthButton'; // Adjust path
import { createClient } from '../../utils/supabase/server'; // Adjust path

// 1. Mock the Supabase client
jest.mock('../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// 2. Mock the Server Action
jest.mock('../../app/login/actions', () => ({
  signOut: jest.fn(),
}));

describe('AuthButton Component', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('renders "Log In / Sign Up" when no user is authenticated', async () => {
    // Arrange: Simulate NO user
    mockGetUser.mockResolvedValue({ data: { user: null } });

    // Act: Await the server component and render it
    const ResolvedComponent = await AuthButton();
    render(ResolvedComponent);

    // Assert: Check if the login link is on the screen
    const loginLink = screen.getByRole('link', { name: /log in \/ sign up/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
    
    // Ensure Logout is NOT there
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  it('renders "Log Out" button when a user is authenticated', async () => {
    // Arrange: Simulate a logged-in user
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });

    // Act
    const ResolvedComponent = await AuthButton();
    render(ResolvedComponent);

    // Assert: Check if the logout button is on the screen
    const logoutButton = screen.getByRole('button', { name: /log out/i });
    expect(logoutButton).toBeInTheDocument();

    // Ensure Login link is NOT there
    expect(screen.queryByRole('link', { name: /log in \/ sign up/i })).not.toBeInTheDocument();
  });
});