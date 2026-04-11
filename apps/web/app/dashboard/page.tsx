import { createClient } from '../../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome back! Your secure user ID is:</p>
      <code className="bg-gray-100 p-2 rounded block mt-2">{user.id}</code>
    </div>
  )
}