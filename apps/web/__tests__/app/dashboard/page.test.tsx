import { render, screen } from '@testing-library/react';
import DashboardPage from '../../../app/dashboard/page';
import { prisma } from '@repo/database';
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

// Polyfill Request for JSDOM
if (typeof global.Request === 'undefined') {
  global.Request = class Request {} as unknown as typeof Request;
}

jest.mock('@repo/database', () => ({
  prisma: {
    project: { findMany: jest.fn() },
  },
}));

jest.mock('../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => { throw new Error('NEXT_REDIRECT'); }),
}));

jest.mock('../../../app/dashboard/actions', () => ({
  handleCollaborationRequest: jest.fn(),
}));

describe('DashboardPage Component', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('redirects to /login if the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    
    // Using the empty searchParams promise to satisfy TypeScript and Next 15
    await expect(DashboardPage({ searchParams: Promise.resolve({}) })).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders the dashboard with the user\'s projects', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } } });
    
    (prisma.project.findMany as jest.Mock).mockResolvedValue([
      { id: 'proj_1', title: 'My Awesome App', stage: 'DEVELOPMENT', collabRequests: [] }
    ]);

    const ResolvedPage = await DashboardPage({ searchParams: Promise.resolve({}) });
    render(ResolvedPage);

    // Verify the project renders
    expect(screen.getByText('My Awesome App')).toBeInTheDocument();
    
    // Verify the manage link renders correctly based on your DOM output
    expect(screen.getByText('Manage Updates →')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage updates/i })).toHaveAttribute('href', '/dashboard/manage/proj_1');
  });
});