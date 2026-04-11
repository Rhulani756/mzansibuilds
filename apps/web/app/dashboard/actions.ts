'use server';

import { createClient } from '../../utils/supabase/server';
import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function handleCollaborationRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const requestId = formData.get('requestId') as string;
  // We explicitly cast the action to match your Prisma RequestStatus Enum
  const action = formData.get('action') as 'ACCEPTED' | 'DECLINED';

  // Security Check: Verify the user actually owns the project this request belongs to
  const request = await prisma.collaborationRequest.findUnique({
    where: { id: requestId },
    include: { project: true }
  });

  if (!request || request.project.userId !== user.id) {
    throw new Error("Unauthorized to modify this request");
  }

  // Update the status in the database
  await prisma.collaborationRequest.update({
    where: { id: requestId },
    data: { status: action }
  });

  // Refresh the dashboard to instantly remove the request from the pending list
  revalidatePath('/dashboard');
}