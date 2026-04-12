import { addManagementMilestone, updateProjectStage } from '.../../../app/dashboard/manage/[id]/actions'; // Adjust path
import { prisma } from '@repo/database';
import { createClient } from '../../../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

jest.mock('@repo/database', () => ({
  prisma: {
    project: { findUnique: jest.fn(), update: jest.fn() },
    milestone: { create: jest.fn() },
  },
}));

jest.mock('../../../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Manage Project Actions', () => {
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

  describe('addManagementMilestone', () => {
    it('throws an error if user is unauthenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      const formData = createMockFormData({ projectId: '123', content: 'Hello' });

      await expect(addManagementMilestone(formData)).rejects.toThrow('Unauthorized');
    });

    it('throws an error if user does not own the project', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'attacker' } } });
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ userId: 'victim' });
      const formData = createMockFormData({ projectId: '123', content: 'Hack' });

      await expect(addManagementMilestone(formData)).rejects.toThrow('Unauthorized: You do not own this project.');
    });

    it('successfully creates a milestone and revalidates paths', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'owner_123' } } });
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ userId: 'owner_123' });
      
      const formData = createMockFormData({ projectId: 'proj_1', content: 'Finished UI' });

      await addManagementMilestone(formData);

      expect(prisma.milestone.create).toHaveBeenCalledWith({
        data: { content: 'Finished UI', projectId: 'proj_1', userId: 'owner_123' },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/manage/proj_1');
      expect(revalidatePath).toHaveBeenCalledWith('/projects/proj_1');
      expect(revalidatePath).toHaveBeenCalledWith('/wall');
    });
  });

  describe('updateProjectStage', () => {
    it('successfully updates the stage and revalidates paths', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'owner_123' } } });
      // The verifyOwnership helper inside updateProjectStage calls this:
      (prisma.project.findUnique as jest.Mock).mockResolvedValue({ userId: 'owner_123' });

      const formData = createMockFormData({ projectId: 'proj_1', stage: 'PROTOTYPING' });

      await updateProjectStage(formData);

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'proj_1' },
        data: { stage: 'PROTOTYPING' },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/manage/proj_1');
      expect(revalidatePath).toHaveBeenCalledWith('/projects/proj_1');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    });
  });
});