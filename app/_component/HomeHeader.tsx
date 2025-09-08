'use client';

import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useSchoolName } from '@/entities/auth/hooks/useSchoolName';
import dynamic from "next/dynamic";
import type { UserInfo, SchoolInfo } from '@/entities/auth/types';

const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false });

async function fetchSchoolName(tokenFromState?: string): Promise<string> {
  const token = tokenFromState ?? (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
  if (!token) {
    // 토큰이 아직 없으면 로컬 저장된 프로필에서 학교명 fallback
    try {
      const profile = typeof window !== 'undefined' ? localStorage.getItem('signupProfile') : null;
      if (profile) {
        const data = JSON.parse(profile);
        if (data?.school?.schoolName) return data.school.schoolName;
        if (data?.schoolName) return data.schoolName;
      }
    } catch {}
    return "";
  }
  try {
    const res = await fetch("/api/v1/members/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });
    if (!res.ok) return "";
    const { data } = await res.json();
    if (data && data.school && data.school.schoolName) return data.school.schoolName;
    if (data && data.schoolName) return data.schoolName;
    return "";
  } catch {
    return "";
  }
}

export default function HomeHeader() {
  const [openSearch, setOpenSearch] = useState(false);
  const { schoolName } = useSchoolName();

  return (
    <>
      <header className='px-4 pt-5 pb-2 flex justify-between items-start bg-gray-50 sticky top-0 z-50'>
        <div className='flex flex-col'>
          <Link href='/'>
            <Image src='/HiTeen.png' alt='HiTeen 로고' width={72} height={24} priority />
          </Link>
          <span className='text-xl font-bold mt-1'>{schoolName || '학교명 없음'}</span>
        </div>
        <div className='flex items-center gap-4 mt-3'>
          <Link href="/write">
            <PlusIcon className='w-6 h-6 text-gray-400 cursor-pointer' />
          </Link>
          <button onClick={() => setOpenSearch(true)}>
            <MagnifyingGlassIcon className='w-6 h-6 text-gray-400' />
          </button>
          <button className='relative'>
            {/* <BellIcon className='w-6 h-6 text-gray-400' />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              6
            </span> */}
          </button>
        </div>
      </header>
      {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
    </>
  );
}
