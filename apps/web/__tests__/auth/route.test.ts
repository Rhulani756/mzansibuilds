/**
 * @jest-environment node
 */
import { GET } from '../../app/auth/callback/route'; // Adjust path to your route.ts
import { NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server'; // Adjust path

// 1. Mock Next.js Server Response
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
  },
}));

// 2. Mock Supabase SSR Client
jest.mock('../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('GET /api/auth/callback', () => {
  const mockExchangeCodeForSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup the mock Supabase client to return our fake exchange function
    (createClient as jest.Mock).mockResolvedValue({
      auth: { exchangeCodeForSession: mockExchangeCodeForSession },
    });
  });

  it('redirects to /dashboard on successful authentication (default next)', async () => {
    // Arrange: Valid code provided, no custom 'next' param
    const req = new Request('http://localhost:3000/api/auth/callback?code=valid-auth-code');
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    // Act
    await GET(req);

    // Assert: It should exchange the code and redirect to the default dashboard
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-auth-code');
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/dashboard');
  });

  it('redirects to a custom route if the "next" parameter is provided', async () => {
    // Arrange: Valid code provided, custom 'next' param points to /settings
    const req = new Request('http://localhost:3000/api/auth/callback?code=valid-auth-code&next=/settings');
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    // Act
    await GET(req);

    // Assert: It should redirect to the custom destination
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-auth-code');
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/settings');
  });

  it('redirects to /login with an error if no code is provided', async () => {
    // Arrange: Request made without a 'code' parameter
    const req = new Request('http://localhost:3000/api/auth/callback');

    // Act
    await GET(req);

    // Assert: It should skip the exchange and immediately redirect to login
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/login?message=Could not authenticate with Google');
  });

  it('redirects to /login with an error if Supabase fails to exchange the code', async () => {
    // Arrange: Valid code provided, but Supabase returns an error (e.g., code expired)
    const req = new Request('http://localhost:3000/api/auth/callback?code=expired-auth-code');
    mockExchangeCodeForSession.mockResolvedValue({ error: { message: 'Auth session missing' } });

    // Act
    await GET(req);

    // Assert: It attempted the exchange, failed, and redirected to login
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('expired-auth-code');
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/login?message=Could not authenticate with Google');
  });
});