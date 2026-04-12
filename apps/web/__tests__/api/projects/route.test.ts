/**
 * @jest-environment node
 */

import { POST } from '../../../app/api/projects/route'; // Adjust path if needed
import { prisma } from '@repo/database';
import { createClient } from '../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. Mock the external dependencies
jest.mock('@repo/database', () => ({
  prisma: {
    project: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Helper function to generate a fake Request object
const createMockRequest = (body: unknown) => {
  return new Request('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

describe('POST /api/projects', () => {
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the Supabase mock to return our fake getUser function
    (createClient as jest.Mock).mockResolvedValue({
      auth: { getUser: mockGetUser },
    });
  });

  it('returns 401 Unauthorized if the user is not logged in', async () => {
    // Arrange: Simulate no user found
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const req = createMockRequest({ title: 'Good Title', description: 'Good description here.' });

    // Act
    const response = await POST(req);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Unauthorized');
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('returns 400 Bad Request if the payload fails Zod validation', async () => {
    // Arrange: User is logged in, but payload has a title that is too short
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    const req = createMockRequest({ title: 'A', description: 'Too short' });

    // Act
    const response = await POST(req);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Invalid payload');
    expect(json.errors.title).toBeDefined(); // Zod should flag the title
    expect(json.errors.description).toBeDefined(); // Zod should flag the description
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('returns 500 Internal Server Error if the database crashes', async () => {
    // Arrange: User is logged in, payload is valid, but Prisma throws an error
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    const req = createMockRequest({ 
      title: 'Valid Title', 
      description: 'This is a completely valid description.',
      stage: 'IDEATION'
    });

    // Simulate database failure
    (prisma.project.create as jest.Mock).mockRejectedValue(new Error('Database connection lost'));

    // Act
    const response = await POST(req);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.message).toBe('Internal Server Error');
  });

  it('returns 201 Created and busts the cache on success', async () => {
    // Arrange: Perfect scenario
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    
    const validPayload = { 
      title: 'Automated Testing Platform', 
      description: 'Building a robust E2E suite for MzansiBuilds using Playwright.',
      stage: 'DEVELOPMENT',
      supportRequired: 'Need a code review'
    };
    
    const req = createMockRequest(validPayload);

    // Simulate Prisma successfully returning the new project
    const mockCreatedProject = { id: 'proj_1', ...validPayload, userId: 'user_123' };
    (prisma.project.create as jest.Mock).mockResolvedValue(mockCreatedProject);

    // Act
    const response = await POST(req);
    const json = await response.json();

    // Assert
    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(mockCreatedProject);
    
    // Verify Prisma was called with the exact right data mapping
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        title: validPayload.title,
        description: validPayload.description,
        stage: validPayload.stage,
        supportRequired: validPayload.supportRequired,
        userId: 'user_123',
      }
    });

    // Verify cache invalidation occurred for the correct paths
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
    expect(revalidatePath).toHaveBeenCalledWith('/feed');
  });
});