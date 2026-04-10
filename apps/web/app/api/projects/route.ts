import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; 
import { z } from 'zod';

/**
 * Zod Schema for Secure Payload Validation
 * Prevents malformed data from reaching the database.
 */
const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  stage: z.enum(['IDEATION', 'PROTOTYPING', 'DEVELOPMENT', 'COMPLETED']).default('IDEATION'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate incoming data
    const validatedData = createProjectSchema.parse(body);

    // 2. Persist to Supabase PostgreSQL via Prisma
    const newProject = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        stage: validatedData.stage,
        // Hardcoding a placeholder userId until we implement Auth
        userId: "test-user-id-123", 
      }
    });

    // 3. Return success response
    return NextResponse.json(
      { success: true, message: "Project created successfully", data: newProject },
      { status: 201 }
    );

  } catch (error) {
    // Catch Zod Validation Errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        // Use .flatten().fieldErrors here instead
        { success: false, message: "Invalid payload", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Catch generic server errors
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}