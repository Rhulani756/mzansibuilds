import { render, screen } from '@testing-library/react';
import SettingsPage from '../../../app/settings/page'; 
import { ensureUserProfile } from '../../../utils/profile';
import { redirect } from 'next/navigation';

jest.mock('../../../utils/profile', () => ({
  ensureUserProfile: jest.fn(),
}));

// Mock redirect to actually throw an error to stop rendering, just like Next.js does
jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => { throw new Error('NEXT_REDIRECT'); }),
}));

jest.mock('../../../app/settings/actions', () => ({
  updateProfile: jest.fn(),
}));

describe('SettingsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /login if the profile cannot be found', async () => {
    (ensureUserProfile as jest.Mock).mockResolvedValue(null);

    // Because we told our mock redirect to throw, we must catch it here
    await expect(SettingsPage()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders the form populated with the user\'s existing profile data', async () => {
    const mockProfile = {
      id: 'user_123',
      username: 'rhulani',
      bio: 'Building MzansiBuilds!',
      githubUrl: 'https://github.com/Rhulani756',
    };
    (ensureUserProfile as jest.Mock).mockResolvedValue(mockProfile);

    const ResolvedPage = await SettingsPage();
    render(ResolvedPage);

    expect(screen.getByRole('heading', { name: /profile settings/i })).toBeInTheDocument();

    // Use querySelector by 'name' attribute since the labels don't have htmlFor attributes
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveValue('rhulani');

    const bioInput = document.querySelector('textarea[name="bio"]') as HTMLTextAreaElement;
    expect(bioInput).toBeInTheDocument();
    expect(bioInput).toHaveValue('Building MzansiBuilds!');

    const githubInput = document.querySelector('input[name="githubUrl"]') as HTMLInputElement;
    expect(githubInput).toBeInTheDocument();
    expect(githubInput).toHaveValue('https://github.com/Rhulani756');

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('handles rendering correctly when optional fields (bio, githubUrl) are null', async () => {
    const mockProfile = {
      id: 'user_123',
      username: 'new_user',
      bio: null,
      githubUrl: null,
    };
    (ensureUserProfile as jest.Mock).mockResolvedValue(mockProfile);

    const ResolvedPage = await SettingsPage();
    render(ResolvedPage);

    // Verify the inputs render with empty strings instead of crashing
    const bioInput = document.querySelector('textarea[name="bio"]') as HTMLTextAreaElement;
    expect(bioInput).toHaveValue('');

    const githubInput = document.querySelector('input[name="githubUrl"]') as HTMLInputElement;
    expect(githubInput).toHaveValue('');
  });
});