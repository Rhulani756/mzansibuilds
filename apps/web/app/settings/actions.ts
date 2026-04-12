'use server';
import { prisma } from '@repo/database';
import { createClient } from '../../utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const username = formData.get('username') as string;
  const bio = formData.get('bio') as string;
  const githubUrl = formData.get('githubUrl') as string;

  await prisma.user.update({
    where: { id: user.id },
    data: { username, bio, githubUrl }
  });

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}