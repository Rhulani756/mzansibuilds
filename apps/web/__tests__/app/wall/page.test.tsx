import { render, screen } from '@testing-library/react';
import CelebrationWallPage from '../../../app/wall/page'; // Adjust path
import { prisma } from '@repo/database';

// Mock Prisma
jest.mock('@repo/database', () => ({
  prisma: { project: { findMany: jest.fn() } },
}));

describe('CelebrationWallPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and description', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
    
    const ResolvedPage = await CelebrationWallPage();
    render(ResolvedPage);

    expect(screen.getByRole('heading', { level: 1, name: /the celebration wall/i })).toBeInTheDocument();
    expect(screen.getByText(/honoring the builders who saw it through to the end/i)).toBeInTheDocument();
  });

  it('renders the empty state if no projects are COMPLETED yet', async () => {
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);
    
    const ResolvedPage = await CelebrationWallPage();
    render(ResolvedPage);

    expect(screen.getByText('No completed builds yet.')).toBeInTheDocument();
    expect(screen.getByText(/who will be the first to claim a spot/i)).toBeInTheDocument();
  });

  it('renders a grid of champion projects with correct stats and usernames', async () => {
    // Arrange: Create a mock completed project with nested relational data
    const mockCompletedProjects = [
      {
        id: 'champion_proj_1',
        title: 'Geeks Chat Reborn',
        description: 'A multi-platform chat system ported to Next.js',
        stage: 'COMPLETED',
        updatedAt: new Date('2026-04-12T12:00:00Z'),
        user: { username: 'rhulani' },
        // Mock 3 milestones
        milestones: [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }],
        // Mock 5 comments
        comments: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' }],
      }
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockCompletedProjects);

    // Act
    const ResolvedPage = await CelebrationWallPage();
    render(ResolvedPage);

    // Assert: Project text
    expect(screen.getByText('Geeks Chat Reborn')).toBeInTheDocument();
    expect(screen.getByText(/A multi-platform chat system/i)).toBeInTheDocument();
    
    // Assert: User Identity
    expect(screen.getByText('@rhulani')).toBeInTheDocument();
    expect(screen.getByText('r')).toBeInTheDocument(); // The avatar circle initial
    
    // Assert: Dynamic Stats
    expect(screen.getByText(/3 Updates/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument(); // 5 comments
    expect(screen.getByText('2026')).toBeInTheDocument(); // Dynamic year from updatedAt
    
    // Assert: Link wrapping the card
    const cardLink = screen.getByRole('link');
    expect(cardLink).toHaveAttribute('href', '/projects/champion_proj_1');
  });
});