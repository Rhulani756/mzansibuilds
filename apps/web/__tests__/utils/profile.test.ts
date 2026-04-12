import { ensureUserProfile } from '../../utils/profile'; // Adjust path
import { prisma } from '@repo/database';
import { createClient } from '../../utils/supabase/server';

// 1. Mock the Prisma Client
jest.mock('@repo/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// 2. Mock the Supabase Client
jest.mock('../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('ensureUserProfile', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('returns null if there is no authenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    
    const result = await ensureUserProfile();
    
    expect(result).toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns the profile immediately if found by ID (1. Fast Path)', async () => {
    const mockUser = { id: 'user_123', email: 'test@derivco.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    
    const mockProfile = { id: 'user_123', username: 'test' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockProfile);

    const result = await ensureUserProfile();

    expect(result).toEqual(mockProfile);
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user_123' } });
  });

  it('updates and returns the profile if found by email but ID mismatches (2. Mismatch Path)', async () => {
    const mockUser = { id: 'new_auth_123', email: 'test@derivco.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    
    const mockProfile = { id: 'old_auth_999', email: 'test@derivco.com', username: 'test' };
    const updatedProfile = { ...mockProfile, id: 'new_auth_123' };

    // First call (by ID) returns null, Second call (by Email) returns the old profile
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockProfile);
      
    (prisma.user.update as jest.Mock).mockResolvedValueOnce(updatedProfile);

    const result = await ensureUserProfile();

    expect(result).toEqual(updatedProfile);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'test@derivco.com' },
      data: { id: 'new_auth_123' },
    });
  });

  it('generates a unique username and creates a new profile (3. Creation Path)', async () => {
    const mockUser = { id: 'user_123', email: 'rhulani@derivco.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    
    const newProfile = { id: 'user_123', email: 'rhulani@derivco.com', username: 'rhulani1' };

    // 1st call (ID): null
    // 2nd call (Email): null
    // 3rd call (Username 'rhulani'): Exists! (Forces the while loop to run)
    // 4th call (Username 'rhulani1'): null (Available!)
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce({ id: 'someone_else', username: 'rhulani' }) 
      .mockResolvedValueOnce(null); 

    (prisma.user.create as jest.Mock).mockResolvedValueOnce(newProfile);

    const result = await ensureUserProfile();

    expect(result).toEqual(newProfile);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        id: 'user_123',
        email: 'rhulani@derivco.com',
        username: 'rhulani1', // It successfully appended the '1'
      },
    });
  });

  it('recovers gracefully from a Prisma P2002 Race Condition (4. The Race Condition Catch)', async () => {
    const mockUser = { id: 'user_123', email: 'test@derivco.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    
    const mockProfile = { id: 'user_123', email: 'test@derivco.com', username: 'test' };

    // 1. ID check: null
    // 2. Email check: null
    // 3. Username check: null
    // 5. Final Email check (inside catch block): returns the profile
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockProfile);

    // Simulate Prisma throwing the exact P2002 error during creation
    (prisma.user.create as jest.Mock).mockRejectedValueOnce({ code: 'P2002' });

    const result = await ensureUserProfile();

    // It should have caught the error, run findUnique one last time, and returned the profile
    expect(result).toEqual(mockProfile);
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(4);
  });

  it('throws the error if Prisma fails with a non-P2002 error', async () => {
    const mockUser = { id: 'user_123', email: 'test@derivco.com' };
    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    
    // Simulate a database crash (not a race condition)
    const dbCrashError = new Error('Database connection failed');
    (prisma.user.create as jest.Mock).mockRejectedValueOnce(dbCrashError);

    // Assert that the function actually throws the error upward
    await expect(ensureUserProfile()).rejects.toThrow('Database connection failed');
  });
});