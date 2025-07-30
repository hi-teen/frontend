import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  if (
    pathname === '/signup' ||
    pathname.startsWith('/signup/') ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  // 그 외 경로에 대해 토큰 검사
  const token = req.cookies.get('token')?.value
  if (!token) {
    // 토큰 없으면 /signup 으로
    const url = req.nextUrl.clone()
    url.pathname = '/signup'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
