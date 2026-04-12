import { prisma } from '@repo/database';
import { createClient } from './supabase/server';

export async function ensureUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  // 1. Fast Path
  let profile = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (profile) return profile;

  // 2. Mismatch Path
  profile = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (profile) {
    return await prisma.user.update({
      where: { email: user.email },
      data: { id: user.id }
    });
  }

  // 3. Creation Path
  const baseUsername = user.email.split('@')[0] || 'user'; // 
  let uniqueUsername = baseUsername;
  let counter = 1;

  while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
    uniqueUsername = `${baseUsername}${counter}`;
    counter++;
  }

  // 4. The Race Condition Catch
  try {
    profile = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: uniqueUsername,
      }
    });
  } catch (error: unknown) { 
    // 🚀 Safe type checking for the Prisma error code
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      profile = await prisma.user.findUnique({
        where: { email: user.email }
      });
    } else {
      throw error;
    }
  }

  return profile;
}