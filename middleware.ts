import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Bypass auth for API routes and auth pages
  if (
    pathname.startsWith('/api') ||
    pathname === '/signup' ||
    pathname.startsWith('/signup/') ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  // Protect other routes: check token in cookies
  const token = req.cookies.get('token')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/signup'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
