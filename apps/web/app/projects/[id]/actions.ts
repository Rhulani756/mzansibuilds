'use server';

import { createClient } from '../../../utils/supabase/server';
import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
  projectId: z.string(),
});

export async function postComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const content = formData.get('content') as string;
  const projectId = formData.get('projectId') as string;
  
  const validatedData = commentSchema.parse({ content, projectId });

  await prisma.comment.create({
    data: {
      content: validatedData.content,
      projectId: validatedData.projectId,
      userId: user.id, // ✅ Properly linked
    }
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function raiseHand(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const projectId = formData.get('projectId') as string;

  // 1. Check if the user already requested to collaborate (prevent spam)
  const existingRequest = await prisma.collaborationRequest.findFirst({
    where: {
      projectId: projectId,
      userId: user.id,
    }
  });

  if (existingRequest) {
    // Silently return if they already raised their hand
    return; 
  }

  // 2. Create the collaboration request
  await prisma.collaborationRequest.create({
    data: {
      projectId: projectId,
      userId: user.id,
      status: 'PENDING',
    }
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function addMilestone(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const projectId = formData.get('projectId') as string;
  const content = formData.get('content') as string;

  // Security Check: Ensure the user actually owns this project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true }
  });

  if (!project || project.userId !== user.id) {
    throw new Error("You can only update your own projects.");
  }

  await prisma.milestone.create({
    data: {
      content,
      projectId,
      userId: user.id, // 🚀 ADDED: This fixes the Milestone Test timeout!
    },
  });

  revalidatePath(`/projects/${projectId}`);
}