'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '@/shared/stores/auth';

function readProfileSchoolName(): string {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('signupProfile') : null;
    if (!raw) return '';
    const data = JSON.parse(raw);
    if (data?.school?.schoolName) return data.school.schoolName as string;
    if (data?.schoolName) return data.schoolName as string;
    return '';
  } catch {
    return '';
  }
}

export function useSchoolName() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [schoolName, setSchoolName] = useState<string>(() => readProfileSchoolName());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchName = async (token?: string) => {
    const bearer = token ?? accessToken ?? (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    if (!bearer) return; // fallback 값은 이미 state에 설정됨
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/members/me', {
        headers: {
          Authorization: `Bearer ${bearer}`,
          Accept: 'application/json',
        },
      });
      if (!res.ok) return;
      const { data } = await res.json();
      const name = data?.school?.schoolName ?? data?.schoolName ?? '';
      if (name) setSchoolName(name);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchName();
    })();
    return () => {
      cancelled = true;
    };
    // accessToken이 바뀌면 재시도
  }, [accessToken]);

  return { schoolName, loading, error, refetch: fetchName };
}


