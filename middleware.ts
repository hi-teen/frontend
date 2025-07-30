import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const token = req.cookies.get('token')?.value

  // 1) static 파일이나 api, _next 폴더 등은 그냥 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  // 2) 로그인된 상태
  if (token) {
    // 루트(/)나 /signup/* 에 왔으면
    if (pathname === '/' || pathname.startsWith('/signup')) {
      // 원래 요청했던 경로가 ?next=... 으로 붙어있다면 그걸로, 아니면 기본 페이지로
      const dest = req.nextUrl.searchParams.get('next') ?? '/home'
      return NextResponse.redirect(new URL(dest, req.url))
    }
    // 그 외 경로는 그냥 통과
    return NextResponse.next()
  }

  // 3) 비로그인 상태 → 무조건 /signup 으로
  if (pathname === '/' || pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/signup', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signup/:path*'],
}
