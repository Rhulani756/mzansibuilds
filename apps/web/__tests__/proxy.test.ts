import { createServerClient } from '@supabase/ssr';
import { proxy } from '../proxy'; // Adjust this path if needed

// 1. Completely mock next/server to bypass the missing Web APIs (Request/Response)
jest.mock('next/server', () => {
  return {
    NextResponse: {
      next: jest.fn().mockReturnValue({
        cookies: {
          set: jest.fn(),
          getAll: jest.fn(),
        },
      }),
      redirect: jest.fn(),
    },
    // Create a fake NextRequest class that mimics exactly what proxy.ts reads
    NextRequest: class MockNextRequest {
      url: string;
      nextUrl: { pathname: string };
      cookies: { getAll: jest.Mock; set: jest.Mock };

      constructor(url: string) {
        this.url = url;
        this.nextUrl = { pathname: new URL(url).pathname };
        this.cookies = {
          getAll: jest.fn().mockReturnValue([]),
          set: jest.fn(),
        };
      }
    },
  };
});

// 2. Mock the Supabase SSR package
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

// Import NextRequest and NextResponse AFTER mocking them
import { NextRequest, NextResponse } from 'next/server';

describe('Proxy / Middleware Logic', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up our fake environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

    (createServerClient as jest.Mock).mockReturnValue({
      auth: { getUser: mockGetUser },
    });
  });

  afterAll(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('redirects an unauthenticated user from /dashboard to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest('http://localhost:3000/dashboard');

    await proxy(req as unknown as NextRequest);
    expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe('/login');
  });

  it('redirects an authenticated user from /login to /dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123', email: 'test@derivco.com' } } });
    const req = new NextRequest('http://localhost:3000/login');

    await proxy(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
    const redirectUrl = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe('/dashboard');
  });

  it('allows an authenticated user to access /dashboard without redirecting', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });
    const req = new NextRequest('http://localhost:3000/dashboard');

    await proxy(req as unknown as NextRequest);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('allows an unauthenticated user to access the /login page without redirecting', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = new NextRequest('http://localhost:3000/login');

    await proxy(req as unknown as NextRequest);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
  });
});