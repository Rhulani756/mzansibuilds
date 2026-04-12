import { render, screen } from '@testing-library/react';
import LiveFeedPage from '../../../app/feed/page'; // Adjust path
import { prisma } from '@repo/database';

// Mock the Prisma Client
jest.mock('@repo/database', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
    },
  },
}));

describe('LiveFeedPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and "Share Your Project" button', async () => {
    // Arrange: Return empty array so the page renders quickly
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const ResolvedPage = await LiveFeedPage();
    render(ResolvedPage);

    // Assert
    expect(screen.getByRole('heading', { name: /live feed/i })).toBeInTheDocument();
    expect(screen.getByText('Discover what the Mzansi community is building right now.')).toBeInTheDocument();
    
    const shareButton = screen.getByRole('link', { name: /\+ share your project/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('href', '/projects/new');
  });

  it('renders the empty state UI when no projects exist', async () => {
    // Arrange
    (prisma.project.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const ResolvedPage = await LiveFeedPage();
    render(ResolvedPage);

    // Assert
    expect(screen.getByText("It's quiet here...")).toBeInTheDocument();
    expect(screen.getByText('Be the first to launch a project on the platform!')).toBeInTheDocument();
  });

  it('renders a grid of projects when data is available', async () => {
    // Arrange: Create mock data with two distinct projects
    const mockProjects = [
      {
        id: 'proj_1',
        title: 'Alpha Analytics',
        description: 'A data dashboard for MzansiBuilds.',
        stage: 'DEVELOPMENT',
        createdAt: new Date('2026-04-12T10:00:00Z'),
        supportRequired: 'Need a UI designer', // Has support request
        user: { username: 'rhulani' }
      },
      {
        id: 'proj_2',
        title: 'Beta Bot',
        description: 'Automated testing bot.',
        stage: 'IDEATION',
        createdAt: new Date('2026-04-11T10:00:00Z'),
        supportRequired: null, // NO support request
        user: { username: 'sarah' }
      }
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

    // Act
    const ResolvedPage = await LiveFeedPage();
    render(ResolvedPage);

    // Assert: Check Project 1
    expect(screen.getByText('Alpha Analytics')).toBeInTheDocument();
    expect(screen.getByText('DEVELOPMENT')).toBeInTheDocument();
    expect(screen.getByText('@rhulani')).toBeInTheDocument();
    expect(screen.getByText('Need a UI designer')).toBeInTheDocument();
    expect(screen.getByText('r')).toBeInTheDocument(); // Avatar initial

    // Assert: Check Project 2
    expect(screen.getByText('Beta Bot')).toBeInTheDocument();
    expect(screen.getByText('IDEATION')).toBeInTheDocument();
    expect(screen.getByText('@sarah')).toBeInTheDocument();
    expect(screen.getByText('s')).toBeInTheDocument(); // Avatar initial

    // Assert: Check dynamic links
    const viewLinks = screen.getAllByRole('link', { name: /view project & discuss/i });
    expect(viewLinks).toHaveLength(2);
    expect(viewLinks[0]).toHaveAttribute('href', '/projects/proj_1');
    expect(viewLinks[1]).toHaveAttribute('href', '/projects/proj_2');
  });

  it('hides the Support Needed section if the project has no supportRequired value', async () => {
    // Arrange: Only one project, specifically without a support request
    const mockProjects = [
      {
        id: 'proj_1',
        title: 'Perfect Project',
        description: 'Everything is fine here.',
        stage: 'COMPLETED',
        createdAt: new Date('2026-04-12T10:00:00Z'),
        supportRequired: null, 
        user: { username: 'rhulani' }
      }
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

    // Act
    const ResolvedPage = await LiveFeedPage();
    render(ResolvedPage);

    // Assert
    expect(screen.getByText('Perfect Project')).toBeInTheDocument();
    expect(screen.queryByText('🙏 Support Needed')).not.toBeInTheDocument();
  });
});