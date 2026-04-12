import { login, signup, signInWithGoogle, signOut } from '../../../app/login/actions'; // Adjust path
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Mock Supabase, Next.js Navigation, and Next.js Cache
jest.mock('../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Auth Server Actions', () => {
  const mockSignInWithPassword = jest.fn();
  const mockSignUp = jest.fn();
  const mockSignInWithOAuth = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Wire up the Supabase mock client
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signUp: mockSignUp,
        signInWithOAuth: mockSignInWithOAuth,
        signOut: mockSignOut,
      },
    });
  });

  const createMockFormData = (email?: string, password?: string) => {
    const formData = new FormData();
    if (email) formData.append('email', email);
    if (password) formData.append('password', password);
    return formData;
  };

  describe('login()', () => {
    it('redirects back to /login with an error message on failure', async () => {
      const formData = createMockFormData('test@example.com', 'wrongpassword');
      mockSignInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });

      await login(formData);

      expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'wrongpassword' });
      expect(redirect).toHaveBeenCalledWith('/login?message=Invalid login credentials');
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('revalidates the layout and redirects to /dashboard on success', async () => {
      const formData = createMockFormData('test@example.com', 'correctpassword');
      mockSignInWithPassword.mockResolvedValue({ error: null }); // Success

      await login(formData);

      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('signup()', () => {
    it('redirects back to /login with an error message on failure', async () => {
      const formData = createMockFormData('test@example.com', 'short');
      mockSignUp.mockResolvedValue({ error: { message: 'Password should be at least 6 characters' } });

      await signup(formData);

      expect(redirect).toHaveBeenCalledWith('/login?message=Password should be at least 6 characters');
    });

    it('revalidates the layout and redirects to /dashboard on success', async () => {
      const formData = createMockFormData('new@example.com', 'securepassword');
      mockSignUp.mockResolvedValue({ error: null });

      await signup(formData);

      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('signInWithGoogle()', () => {
    it('redirects to /login with an error if initialization fails', async () => {
      mockSignInWithOAuth.mockResolvedValue({ data: {}, error: { message: 'OAuth config error' } });

      await signInWithGoogle();

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/auth/callback' },
      });
      expect(redirect).toHaveBeenCalledWith('/login?message=Could not initialize Google authentication');
    });

    it('redirects to the provided Google OAuth URL on success', async () => {
      mockSignInWithOAuth.mockResolvedValue({ 
        data: { url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...' }, 
        error: null 
      });

      await signInWithGoogle();

      expect(redirect).toHaveBeenCalledWith('https://accounts.google.com/o/oauth2/v2/auth?client_id=...');
    });
  });

  describe('signOut()', () => {
    it('signs the user out, revalidates the cache, and redirects to the landing page', async () => {
      await signOut();

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
      expect(redirect).toHaveBeenCalledWith('/');
    });
  });
});