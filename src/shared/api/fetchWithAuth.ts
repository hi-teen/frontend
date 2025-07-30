import { NextRouter } from 'next/router'

export async function fetchWithAuth<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  // 로컬스토리지에서 토큰 꺼내오기
  const token = typeof window !== 'undefined' && localStorage.getItem('token')
  const headers = new Headers(init?.headers as HeadersInit)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(input, {
    ...init,
    headers,
  })

  // 401 Unauthorized인 경우 로그인 페이지로
  if (res.status === 401) {
    window.location.href = '/login'
    return Promise.reject(new Error('로그인 필요'))
  }

  if (!res.ok) {
    const err = await res.text()
    return Promise.reject(new Error(err || res.statusText))
  }

  return (await res.json()) as T
}
