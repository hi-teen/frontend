'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SearchModal = dynamic(() => import('../../_component/SearchModal'), {
  ssr: false,
}) as React.ComponentType<{ onClose: () => void }>;

interface Props {
  selected: string;
  onOpen: () => void;
  onSelectBoard: (key: string) => void;
}

const boards = [
  { key: 'ALL', name: '전체', emoji: '📋' },
  { key: 'FREE', name: '자유게시판', emoji: '😊' },
  { key: 'SECRET', name: '비밀게시판', emoji: '🤫' },
  { key: 'INFORMATION', name: '정보게시판', emoji: '💡' },
  { key: 'GRADE1', name: '1학년게시판', emoji: '1️⃣' },
  { key: 'GRADE2', name: '2학년게시판', emoji: '2️⃣' },
  { key: 'GRADE3', name: '3학년게시판', emoji: '3️⃣' },
];

export default function BoardHeader({
  selected,
  onOpen,
  onSelectBoard,
}: Props) {
  const [openSearch, setOpenSearch] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [schoolName, setSchoolName] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAndSetSchool() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) {
        setSchoolName('학교명 없음');
        return;
      }
      try {
        const res = await fetch('/api/v1/members/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        // 성공 응답 형태 { success, header, data: { email, name, ... , school: {schoolName} } }
        if (json?.data?.school?.schoolName) {
          setSchoolName(json.data.school.schoolName);
          // 최신 정보 localStorage에도 저장
          localStorage.setItem('signupProfile', JSON.stringify(json.data));
        } else {
          setSchoolName('');
        }
      } catch {
        // 서버 요청 실패시 localStorage fallback
        const profileStr = typeof window !== 'undefined' ? localStorage.getItem('signupProfile') : null;
        if (profileStr) {
          try {
            const profile = JSON.parse(profileStr);
            if (profile.school?.schoolName) {
              setSchoolName(profile.school.schoolName);
            } else if (profile.schoolName) {
              setSchoolName(profile.schoolName);
            }
          } catch {
            setSchoolName('');
          }
        } else {
          setSchoolName('');
        }
      }
    }
    fetchAndSetSchool();
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className='px-4 pt-5 pb-3 bg-gray-50 sticky top-0 z-50'>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col'>
            <Link href='/'>
              <Image src='/HiTeen.png' alt='HiTeen 로고' width={72} height={24} priority />
            </Link>
            <span className='text-xl font-bold mt-1'>{schoolName || '학교명 없음'}</span>
          </div>
          <div className='flex items-center gap-4 mt-3'>
            <Link href="/write">
              <PlusIcon className="w-6 h-6 text-gray-400 cursor-pointer" />
            </Link>
            <button onClick={() => setOpenSearch(true)}>
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
            </button>
            <button className="relative">
              {/* <BellIcon className="w-6 h-6 text-gray-400" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                6
              </span> */}
            </button>
          </div>
        </div>
        <div className="relative mt-3">
          <div className="overflow-x-auto scrollbar-hide pr-6 pl-0" ref={scrollRef}>
            <div className="flex gap-2 min-w-max">
              {boards.map(({ key, name, emoji }) => (
                <button
                  key={key}
                  onClick={() => onSelectBoard(key)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-all duration-150
                    ${
                      selected === key
                        ? 'bg-blue-50 text-blue-600 border-blue-400 font-semibold'
                        : 'bg-gray-100 text-gray-600 border-transparent'
                    }`}
                >
                  <span>{emoji}</span>
                  {name}
                </button>
              ))}
            </div>
          </div>
          {showLeftFade && (
            <div className="pointer-events-none absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent" />
          )}
          {showRightFade && (
            <div className="pointer-events-none absolute top-0 right-8 h-full w-6 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent" />
          )}
          <div className="absolute top-0 right-0 h-full w-8 bg-gray-50 z-10 pointer-events-none" />
          <button
            onClick={onOpen}
            className="absolute top-1/2 right-1 -translate-y-1/2 z-20"
          >
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </header>
      {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
    </>
  );
}
