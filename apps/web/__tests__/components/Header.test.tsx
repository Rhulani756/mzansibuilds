import { render, screen } from '@testing-library/react';
import Header from '../../components/Header'; // Adjust path
import { ensureUserProfile } from '../../utils/profile'; // Adjust path

// 1. Mock the profile utility
jest.mock('../../utils/profile', () => ({
  ensureUserProfile: jest.fn(),
}));

// 2. Mock the AuthButton to keep this test isolated to just the Header
jest.mock('../../components/AuthButton', () => {
  return function DummyAuthButton() {
    return <div data-testid="mock-auth-button">Mock Auth</div>;
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders public navigation links and AuthButton for all users', async () => {
    (ensureUserProfile as jest.Mock).mockResolvedValue(null);
    const ResolvedHeader = await Header();
    render(ResolvedHeader);

    // Using getByText is much more reliable here
    expect(screen.getByText(/Mzansi/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Feed/i)).toBeInTheDocument();
    expect(screen.getByText(/Celebration Wall/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-auth-button')).toBeInTheDocument();
  });

  it('hides the Dashboard and Profile pill when the user is NOT logged in', async () => {
    // Arrange: Simulate a guest
    (ensureUserProfile as jest.Mock).mockResolvedValue(null);

    // Act
    const ResolvedHeader = await Header();
    render(ResolvedHeader);

    // Assert: Dashboard should be missing
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
    
    // Assert: Profile settings link should be missing
    const settingsLink = screen.queryByRole('link', { name: /@/i }); // Looking for the @username text
    expect(settingsLink).not.toBeInTheDocument();
  });

  it('renders the Dashboard link and Profile pill when a user IS logged in', async () => {
    (ensureUserProfile as jest.Mock).mockResolvedValue({
      id: 'user_123',
      username: 'rhulani',
    });

    const ResolvedHeader = await Header();
    render(ResolvedHeader);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/@rhulani/i)).toBeInTheDocument();
    expect(screen.getByText('r')).toBeInTheDocument(); 
  });
});