import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getUser() for secure server-side auth
  const { data: { user } } = await supabase.auth.getUser()

  const isAccessingDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAccessingLogin = request.nextUrl.pathname.startsWith('/login')

  // 1. If not logged in and trying to access dashboard -> Redirect to login
  if (!user && isAccessingDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If already logged in and trying to access login -> Redirect to dashboard
  if (user && isAccessingLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  // Added '/dashboard' to the matcher so it catches the root page, not just sub-paths
  matcher: ['/dashboard', '/dashboard/:path*', '/api/projects/:path*', '/login'], 
}