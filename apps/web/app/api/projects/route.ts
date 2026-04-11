import { NextResponse } from 'next/server';
import { prisma } from '@repo/database'; 
import { z } from 'zod';
import { createClient } from '../../../utils/supabase/server'; // Import your new auth utility

/**
 * Zod Schema for Secure Payload Validation
 */
const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  stage: z.enum(['IDEATION', 'PROTOTYPING', 'DEVELOPMENT', 'COMPLETED']).default('IDEATION'),
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user securely via Supabase SSR
    // Note the 'await' here because we updated to the modern Next.js async cookies!
    const supabase = await createClient(); 
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If no user is logged in, reject the request immediately
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You must be logged in to create a project." }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // 2. Validate incoming data
    const validatedData = createProjectSchema.parse(body);

    // 3. Persist to Supabase PostgreSQL via Prisma
    const newProject = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        stage: validatedData.stage,
        userId: user.id, // Successfully using the real, verified Supabase UUID!
      }
    });

    // 4. Return success response
    return NextResponse.json(
      { success: true, message: "Project created successfully", data: newProject },
      { status: 201 }
    );

  } catch (error) {
    // Catch Zod Validation Errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
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