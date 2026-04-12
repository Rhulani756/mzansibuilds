import { render, screen } from '@testing-library/react';
import ProjectDetailsPage from '../../../../app/projects/[id]/page'; 
import { prisma } from '@repo/database';
import { createClient } from '../../../../utils/supabase/server';
import { notFound } from 'next/navigation';

jest.mock('@repo/database', () => ({
  prisma: { project: { findUnique: jest.fn() } },
}));

jest.mock('../../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// FIX: Make notFound throw to halt execution
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND'); }),
}));

jest.mock('../../../../app/projects/[id]/actions', () => ({
  postComment: jest.fn(),
  raiseHand: jest.fn(),
  addMilestone: jest.fn(),
}));

describe('ProjectDetailsPage Component', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  const baseProjectData = {
    id: 'proj_1',
    title: 'Geeks Chat',
    description: 'A multi-platform chat system.',
    stage: 'DEVELOPMENT',
    userId: 'owner_123',
    createdAt: new Date('2026-04-12T10:00:00Z'),
    supportRequired: 'Need a UI designer',
    user: { username: 'rhulani' },
    comments: [
      { id: 'c1', content: 'Looks great!', userId: 'visitor_456', createdAt: new Date(), user: { username: 'sarah' } },
      { id: 'c2', content: 'Thanks!', userId: 'owner_123', createdAt: new Date(), user: { username: 'rhulani' } },
    ],
    milestones: [
      { id: 'm1', content: 'Setup database', createdAt: new Date() }
    ],
    collabRequests: []
  };

  it('calls notFound() if the project does not exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(null);

    // We expect the component to throw our mocked notFound error
    await expect(ProjectDetailsPage({ params: Promise.resolve({ id: 'ghost_proj' }) })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('renders guest view correctly (no forms, prompts to login)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(baseProjectData);

    const ResolvedPage = await ProjectDetailsPage({ params: Promise.resolve({ id: 'proj_1' }) });
    render(ResolvedPage);

    expect(screen.getByText('Geeks Chat')).toBeInTheDocument();
    
    // FIX: @rhulani appears in the header AND in the comments. We assert that it exists at least once.
    expect(screen.getAllByText('@rhulani').length).toBeGreaterThan(0);
    
    expect(screen.getByText('Setup database')).toBeInTheDocument();
    expect(screen.getByText('Log in to join the conversation.')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Share a new achievement...')).not.toBeInTheDocument();
  });

  it('renders owner view correctly', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'owner_123' } } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(baseProjectData);

    const ResolvedPage = await ProjectDetailsPage({ params: Promise.resolve({ id: 'proj_1' }) });
    render(ResolvedPage);

    expect(screen.getByPlaceholderText('Share a new achievement...')).toBeInTheDocument();
    expect(screen.getByText('You own this build.')).toBeInTheDocument();
  });

  it('renders visitor view correctly', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'visitor_456' } } });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue(baseProjectData);

    const ResolvedPage = await ProjectDetailsPage({ params: Promise.resolve({ id: 'proj_1' }) });
    render(ResolvedPage);

    expect(screen.queryByPlaceholderText('Share a new achievement...')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /raise hand to help/i })).toBeInTheDocument();
  });
});