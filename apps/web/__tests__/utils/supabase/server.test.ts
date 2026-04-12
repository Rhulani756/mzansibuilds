import { createClient } from '../../../utils/supabase/server'; // adjust path

// Mock the environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key';

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockImplementation(() => Promise.resolve({
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  })),
}));

describe('Supabase Server Client Utility', () => {
  it('should initialize the server client without crashing', async () => {
    const client = await createClient();
    expect(client).toBeDefined();
    expect(typeof client.auth.getUser).toBe('function');
  });
});