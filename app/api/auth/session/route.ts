import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken, refreshToken } = await req.json();
    const res = NextResponse.json({ ok: true });
    const isProd = process.env.NODE_ENV === 'production';

    if (accessToken) {
      res.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 2, // 2시간
      });
    }
    if (refreshToken) {
      res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 14, // 14일
      });
    }
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'invalid body' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
  res.cookies.set('accessToken', '', { ...opts, maxAge: 0 });
  res.cookies.set('refreshToken', '', { ...opts, maxAge: 0 });
  return res;
}


