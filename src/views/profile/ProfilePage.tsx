'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, MagnifyingGlassIcon, BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BoardItem } from '@/shared/api/board';

const SearchModal = dynamic(() => import('../../../app/_component/SearchModal'), {
  ssr: false,
}) as React.ComponentType<{ onClose: () => void }>;

export default function ProfilePage() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [lovedPosts, setLovedPosts] = useState<BoardItem[]>([]);

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('https://hiteen.site/api/v1/loves/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('좋아요 글 불러오기 실패');
        return res.json();
      })
      .then(setLovedPosts)
      .catch(console.error);
  }, []);

  return (
    <>
      {/* 상단 헤더 */}
      <header className='px-4 pt-5 flex justify-between items-start bg-gray-50 sticky top-0 z-50'>
        <div className='flex flex-col'>
          <Link href='/'>
            <Image src='/hiteen.svg' alt='HiTeen 로고' width={72} height={24} priority />
          </Link>
          <span className='text-xl font-bold mt-1'>한국고등학교</span>
        </div>
      </header>

      {/* 프로필 페이지 본문 */}
      <div className="px-4 pt-4 pb-20 max-w-lg mx-auto bg-gray-50 space-y-6">
        {/* 프로필 박스 */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Image src="/usericon.png" alt="user icon" width={24} height={24} />
            </div>
            <div className="text-sm leading-tight">
              <p className="font-semibold">홍길동</p>
              <p className="text-gray-500">한국고등학교</p>
              <p className="text-gray-400 text-xs">2학년 2반</p>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="text-sm text-blue-500 font-semibold"
          >
            수정
          </button>
        </div>

        {/* 나의 글 */}
        <div
          onClick={() => router.push('/profile/posts')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">나의 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* 나의 댓글 */}
        <div
          onClick={() => router.push('/profile/comments')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">나의 댓글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* 스크랩한 글 */}
        <div
          onClick={() => router.push('/profile/scraps')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">스크랩한 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* 좋아요한 글 */}
        <div
          onClick={() => router.push('/profile/likes')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">좋아요한 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* 고객 지원 */}
        <div className="bg-white p-4 rounded-2xl text-sm shadow-sm">
          <p className="font-semibold mb-2">고객지원</p>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:underline cursor-pointer">약관 및 정책</li>
            <li className="hover:underline cursor-pointer">커뮤니티 정책</li>
          </ul>
        </div>
      </div>

      {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
    </>
  );
}
