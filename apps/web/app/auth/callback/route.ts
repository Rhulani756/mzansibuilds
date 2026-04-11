import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // We can pass a 'next' param to redirect them anywhere, defaulting to dashboard
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Success! Send them to the dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something goes wrong, send them back to login with an error
  return NextResponse.redirect(`${origin}/login?message=Could not authenticate with Google`)
}