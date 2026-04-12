import { updateProfile } from '../../../app/settings/actions'; // Adjust path
import { prisma } from '@repo/database';
import { createClient } from '../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@repo/database', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Settings Server Actions', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  const createMockFormData = (fields: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    return formData;
  };

  it('throws an error if the user is unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const formData = createMockFormData({ username: 'hacker' });

    await expect(updateProfile(formData)).rejects.toThrow('Unauthorized');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('successfully updates the profile and busts the cache', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });
    
    const formData = createMockFormData({
      username: 'rhulani_dev',
      bio: 'Full-stack engineer building cool things.',
      githubUrl: 'https://github.com/rhulani',
    });

    await updateProfile(formData);

    // Verify Prisma was called with the exact right data mapped to the logged-in user
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user_123' },
      data: {
        username: 'rhulani_dev',
        bio: 'Full-stack engineer building cool things.',
        githubUrl: 'https://github.com/rhulani',
      },
    });

    // Verify cache invalidation occurred
    expect(revalidatePath).toHaveBeenCalledWith('/settings');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });
});