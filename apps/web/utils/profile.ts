import { prisma } from '@repo/database';
import { createClient } from './supabase/server';

export async function ensureUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  // 1. Fast Path: Check if the profile already exists by ID
  let profile = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (profile) return profile;

  // 2. Mismatch Path: Did Supabase auth get reset but Prisma didn't?
  // If we find the email under an old ID, we update it to the new Supabase Auth ID.
  profile = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (profile) {
    return await prisma.user.update({
      where: { email: user.email },
      data: { id: user.id } // Heal the broken link!
    });
  }

  // 3. Creation Path: Auto-generate a unique username
  let baseUsername = user.email.split('@')[0] || 'user';
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
  } catch (error: any) {
    // If two Next.js components tried to create this simultaneously, 
    // the second one will hit the Unique Constraint error. 
    // We catch it and just return the profile the first component successfully made.
    if (error.code === 'P2002') { // Prisma's unique constraint error code
      profile = await prisma.user.findUnique({
        where: { email: user.email }
      });
    } else {
      throw error; // If it's a different database error, we still want to know!
    }
  }

  return profile;
}