import { postComment, raiseHand, addMilestone } from '.../../../app/projects/[id]/actions'; // Adjust path
import { prisma } from '@repo/database';
import { createClient } from '../../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

jest.mock('@repo/database', () => ({
  prisma: {
    comment: { create: jest.fn() },
    collaborationRequest: { findFirst: jest.fn(), create: jest.fn() },
    project: { findUnique: jest.fn() },
    milestone: { create: jest.fn() },
  },
}));

jest.mock('../../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Project Details Server Actions', () => {
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

  describe('postComment', () => {
    it('throws if the comment is empty (Zod Validation)', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });
      const formData = createMockFormData({ projectId: 'proj_1', content: '' });

      await expect(postComment(formData)).rejects.toThrow(z.ZodError);
      expect(prisma.comment.create).not.toHaveBeenCalled();
    });

    it('creates a comment and revalidates the page', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });
      const formData = createMockFormData({ projectId: 'proj_1', content: 'Great work!' });

      await postComment(formData);

      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: { content: 'Great work!', projectId: 'proj_1', userId: 'user_1' }
      });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/proj_1');
    });
  });

  describe('raiseHand', () => {
    it('silently returns if the user already requested to collaborate', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });
      const formData = createMockFormData({ projectId: 'proj_1' });

      // Simulate an existing request in the database
      (prisma.collaborationRequest.findFirst as jest.Mock).mockResolvedValue({ id: 'req_1' });

      await raiseHand(formData);

      expect(prisma.collaborationRequest.create).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('creates a new collaboration request if none exists', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });
      const formData = createMockFormData({ projectId: 'proj_1' });

      (prisma.collaborationRequest.findFirst as jest.Mock).mockResolvedValue(null);

      await raiseHand(formData);

      expect(prisma.collaborationRequest.create).toHaveBeenCalledWith({
        data: { projectId: 'proj_1', userId: 'user_1', status: 'PENDING' }
      });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/proj_1');
    });
  });

  describe('addMilestone', () => {
    it('throws an error if a non-owner tries to add a milestone', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'attacker_99' } } });
      const formData = createMockFormData({ projectId: 'proj_1', content: 'Hacked milestone' });

      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ userId: 'real_owner_1' });

      await expect(addMilestone(formData)).rejects.toThrow('You can only update your own projects.');
      expect(prisma.milestone.create).not.toHaveBeenCalled();
    });

    it('creates a milestone if the user is the verified owner', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'owner_1' } } });
      const formData = createMockFormData({ projectId: 'proj_1', content: 'Launched v1' });

      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ userId: 'owner_1' });

      await addMilestone(formData);

      expect(prisma.milestone.create).toHaveBeenCalledWith({
        data: { content: 'Launched v1', projectId: 'proj_1', userId: 'owner_1' }
      });
      expect(revalidatePath).toHaveBeenCalledWith('/projects/proj_1');
    });
  });
});