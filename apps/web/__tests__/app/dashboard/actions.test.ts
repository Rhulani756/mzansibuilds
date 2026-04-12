import { handleCollaborationRequest } from '../../../app/dashboard/actions'; // Adjust path
import { prisma } from '@repo/database';
import { createClient } from '../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Mock dependencies
jest.mock('@repo/database', () => ({
  prisma: {
    collaborationRequest: {
      findUnique: jest.fn(),
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

describe('handleCollaborationRequest Action', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  // Helper to quickly create FormData in tests
  const createMockFormData = (requestId: string, action: string) => {
    const formData = new FormData();
    formData.append('requestId', requestId);
    formData.append('action', action);
    return formData;
  };

  it('throws an error if the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const formData = createMockFormData('req_123', 'ACCEPTED');

    await expect(handleCollaborationRequest(formData)).rejects.toThrow('Unauthorized');
    expect(prisma.collaborationRequest.findUnique).not.toHaveBeenCalled();
  });

  it('throws an error if the request does not exist or user does not own the project', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'attacker_999' } } });
    const formData = createMockFormData('req_123', 'ACCEPTED');

    // Simulate finding the request, but it belongs to user 'victim_111'
    (prisma.collaborationRequest.findUnique as jest.Mock).mockResolvedValue({
      id: 'req_123',
      project: { userId: 'victim_111' } 
    });

    await expect(handleCollaborationRequest(formData)).rejects.toThrow('Unauthorized to modify this request');
    expect(prisma.collaborationRequest.update).not.toHaveBeenCalled();
  });

  it('successfully updates the request status to ACCEPTED and busts the cache', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'valid_owner_123' } } });
    const formData = createMockFormData('req_123', 'ACCEPTED');

    (prisma.collaborationRequest.findUnique as jest.Mock).mockResolvedValue({
      id: 'req_123',
      project: { userId: 'valid_owner_123' } 
    });

    await handleCollaborationRequest(formData);

    expect(prisma.collaborationRequest.update).toHaveBeenCalledWith({
      where: { id: 'req_123' },
      data: { status: 'ACCEPTED' }
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });
});