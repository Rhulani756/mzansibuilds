import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Safely determine the base URL for the return trip
  const siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
    : 'http://localhost:3000'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Success! Send them to the dashboard using the correct domain
      return NextResponse.redirect(`${siteUrl}${next}`)
    } else {
      // Log the exact error to your Vercel logs if Supabase rejects the code
      console.error("Supabase Auth Error:", error.message)
    }
  }

  // If something goes wrong, send them back to login with an error message
  return NextResponse.redirect(`${siteUrl}/login?message=Could not authenticate with Google`)
}