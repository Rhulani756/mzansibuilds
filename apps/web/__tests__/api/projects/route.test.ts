import 'whatwg-fetch';

import { POST } from '../../../app/api/projects/route';
import { prisma } from '@repo/database';


// 1. Mock NextResponse to return a plain object instead of a complex Edge Response
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

// 2. Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    getAll: jest.fn(() => []),
  })),
}));

// 3. Mock Supabase Server Client
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => Promise.resolve({ 
        data: { user: { id: 'test-user-123' } }, 
        error: null 
      })),
    },
  })),
}));

// 4. Mock the Database (ensure this path matches your setup)
jest.mock('@repo/database', () => ({
  prisma: {
    project: {
      create: jest.fn().mockResolvedValue({ id: 'test-123', title: 'Test Project' }),
    },
  },
}));

describe('Project API - POST /api/projects', () => {
  // Clear the mock history before every test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a project and return 201 (Happy Path)', async () => {
    // Arrange: Tell the mocked Prisma what to return when called
    const mockDbResponse = {
      id: 'test-123',
      title: 'Oom Pablo Masterpiece',
      description: 'This is a valid description that passes Zod.',
      stage: 'IDEATION',
      supportRequired: 'Need help with the Postgres schema.', // ADDED
      userId: 'test-user-id-123',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    (prisma.project.create as jest.Mock).mockResolvedValue(mockDbResponse);

    // Act: Simulate a perfect incoming Next.js Request
    const req = new Request('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Oom Pablo Masterpiece',
        description: 'This is a valid description that passes Zod.',
        stage: 'IDEATION',
        supportRequired: 'Need help with the Postgres schema.', // ADDED
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    // Assert: Verify the response and database interaction
    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('test-123');
    
    // Specifically ensure the database mock was called with the new fields
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        stage: 'IDEATION',
        supportRequired: 'Need help with the Postgres schema.'
      })
    });
  });
});