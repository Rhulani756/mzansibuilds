import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If the user isn't logged in, instantly kick them to the login page
  if (!user) {
    redirect('/login');
  }

  // Otherwise, render the page (like the New Project form)
  return <>{children}</>;
}