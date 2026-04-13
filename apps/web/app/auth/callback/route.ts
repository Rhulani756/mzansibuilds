import { NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // Default to dashboard if no 'next' param is provided
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Use the exact forwarded host if we are on Vercel, otherwise fallback to standard origin.
      // This prevents cookie mismatches between Vercel deployment URLs and branch URLs.
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // Localhost routing
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else if (forwardedHost) {
        // Vercel production routing
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        // Fallback routing
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      }
    } else {
      console.error("Supabase Auth Error:", error.message)
    }
  }

  // If something goes wrong, send them back to login
  return NextResponse.redirect(`${requestUrl.origin}/login?message=Could not authenticate`)
}