import { render, screen } from '@testing-library/react';
import ManageProjectPage from '../../../../../app/dashboard/manage/[id]/page'; 
import { prisma } from '@repo/database';
import { createClient } from '../../../../../utils/supabase/server';
import { notFound, redirect } from 'next/navigation';

jest.mock('@repo/database', () => ({
  prisma: { project: { findUnique: jest.fn() } },
}));

jest.mock('../../../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// FIX: Make redirect and notFound throw to halt execution like Next.js does
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND'); }),
  redirect: jest.fn(() => { throw new Error('NEXT_REDIRECT'); }),
}));

jest.mock('../../../../../app/dashboard/manage/[id]/actions', () => ({
  addManagementMilestone: jest.fn(),
}));

describe('ManageProjectPage Component', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('redirects to /login if the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    
    // We expect the component to throw our mocked redirect error
    await expect(ManageProjectPage({ params: Promise.resolve({ id: 'proj_123' }) })).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('calls notFound() if the project does not exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);
    
    // We expect the component to throw our mocked notFound error
    await expect(ManageProjectPage({ params: Promise.resolve({ id: 'ghost_proj' }) })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('redirects to the dashboard if a non-owner tries to manage the project', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'sneaky_visitor' } } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: 'proj_123',
      userId: 'real_owner',
      milestones: [], 
    });

    await expect(ManageProjectPage({ params: Promise.resolve({ id: 'proj_123' }) })).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('renders the management dashboard for the authenticated project owner', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'owner_123' } } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({
      id: 'proj_123',
      title: 'MzansiBuilds App',
      userId: 'owner_123',
      milestones: [],
      collabRequests: [
        { id: 'req_1', user: { username: 'helper_dev' }, status: 'PENDING' }
      ]
    });

    const ResolvedPage = await ManageProjectPage({ params: Promise.resolve({ id: 'proj_123' }) });
    render(ResolvedPage);
    
    expect(screen.getByText(/MzansiBuilds App/i)).toBeInTheDocument();
  });
});