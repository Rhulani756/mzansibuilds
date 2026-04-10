import 'whatwg-fetch';

import { POST } from '../../../app/api/projects/route';
import { prisma } from '@repo/database';

// 1. Mock the entire database package so we don't hit Supabase
jest.mock('@repo/database', () => ({
  prisma: {
    project: {
      create: jest.fn(),
    },
  },
}));

// 2. Mock Next.js's NextResponse to work smoothly in Jest
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      return new Response(JSON.stringify(body), {
        status: init?.status || 200,
        headers: { 'Content-Type': 'application/json' },
      });
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
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    // Assert: Verify the response and database interaction
    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('test-123');
    expect(prisma.project.create).toHaveBeenCalledTimes(1);
  });

  it('should block invalid payloads and return 400 (Sad Path)', async () => {
    // Act: Simulate a bad request (title too short, no description)
    const req = new Request('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'No', // Fails Zod validation
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    // Assert: Verify Zod stopped the request
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.errors).toHaveProperty('title');
    expect(json.errors).toHaveProperty('description');
    
    // Most importantly, ensure the database was NEVER called
    expect(prisma.project.create).not.toHaveBeenCalled();
  });
});