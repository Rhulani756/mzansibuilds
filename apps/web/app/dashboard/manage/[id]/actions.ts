'use server';

import { prisma } from '@repo/database';
import { createClient } from '../../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to verify ownership
async function verifyOwnership(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { userId: true }
  });

  if (!project || project.userId !== user.id) {
    throw new Error("You do not have permission to manage this project.");
  }
  return true;
}

export async function addManagementMilestone(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const content = formData.get('content') as string;

  await verifyOwnership(projectId);

  await prisma.milestone.create({
    data: { content, projectId },
  });

  revalidatePath(`/dashboard/manage/${projectId}`);
  revalidatePath(`/projects/${projectId}`); // Update public feed too!
  revalidatePath('/wall');
}

export async function updateProjectStage(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const stage = formData.get('stage') as 'IDEATION' | 'PROTOTYPING' | 'DEVELOPMENT' | 'COMPLETED';
  await verifyOwnership(projectId);

  await prisma.project.update({
    where: { id: projectId },
    data: { stage },
  });

  revalidatePath(`/dashboard/manage/${projectId}`);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/dashboard');
}