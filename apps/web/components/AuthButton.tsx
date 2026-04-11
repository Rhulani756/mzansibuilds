import { createClient } from '../utils/supabase/server'
import { signOut } from '../app/login/actions'
import Link from 'next/link'

export default async function AuthButton() {
  // 1. Check the secure session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 2. If NO user is logged in, show the Login button
  if (!user) {
    return (
      <Link 
        href="/login" 
        className="text-sm font-medium text-white hover:text-green-400 transition-colors"
      >
        Log In / Sign Up
      </Link>
    )
  }

  // 3. If a user IS logged in, show the Logout button
  return (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Log Out
        </button>
      </form>
    </div>
  )
}