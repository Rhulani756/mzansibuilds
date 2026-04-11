import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; 
import { z } from 'zod';
import { createClient } from '../../../utils/supabase/server';

/**
 * Zod Schema for Secure Payload Validation
 */
const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  stage: z.enum(['IDEATION', 'PROTOTYPING', 'DEVELOPMENT', 'COMPLETED']).default('IDEATION'),
  // ADDED: Make sure we explicitly allow and validate the new support field
  supportRequired: z.string().max(100).optional(), 
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient(); 
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in to create a project." }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate incoming data
    const validatedData = createProjectSchema.parse(body);

    // Persist to Supabase PostgreSQL via Prisma
    const newProject = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        stage: validatedData.stage,
        supportRequired: validatedData.supportRequired, // ADDED: Send it to the database!
        userId: user.id, 
      }
    });

    return NextResponse.json(
      { success: true, message: "Project created successfully", data: newProject },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid payload", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Failed to create project:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}