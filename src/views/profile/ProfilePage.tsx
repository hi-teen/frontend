'use client';

import type { UserInfo } from '@/shared/api/auth';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BoardItem } from '@/shared/api/board';
import { fetchMe } from '@/shared/api/auth';

const SearchModal = dynamic(() => import('../../../app/_component/SearchModal'), {
  ssr: false,
}) as React.ComponentType<{ onClose: () => void }>;


export default function ProfilePage() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [lovedPosts, setLovedPosts] = useState<BoardItem[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // 좋아요한 글 불러오기 (실패시 무시)
    fetch('https://hiteen.site/api/v1/loves/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setLovedPosts)
      .catch(() => setLovedPosts([]));

    // 사용자 정보 불러오기 (실패 또는 값 없음 시 signupProfile fallback)
    fetchMe()
      .then((data: UserInfo | null) => {
        if (data && (data.name || data.nickname)) {
          // school 필드 객체인 경우
          if (typeof data.school === 'object' && data.school !== null) {
            setUser({
              ...data,
              schoolId: data.school.id,
              schoolName: data.school.schoolName,
            });
          } else {
            setUser(data);
          }
        } else {
          // fallback
          const profileStr = localStorage.getItem('signupProfile');
          if (profileStr) {
            try {
              const profile = JSON.parse(profileStr);
              setUser({
                ...profile,
                email: profile.email ?? '',
                schoolName: profile.schoolName ?? '',
              });
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {
        // fetchMe 실패시 fallback
        const profileStr = localStorage.getItem('signupProfile');
        if (profileStr) {
          try {
            const profile = JSON.parse(profileStr);
            setUser({
              ...profile,
              email: profile.email ?? '',
              schoolName: profile.schoolName ?? '',
            });
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      });
  }, []);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="px-4 pt-5 flex justify-between items-start bg-gray-50 sticky top-0 z-50">
        <div className="flex flex-col">
          <Link href="/">
            <Image src="/hiteen.svg" alt="HiTeen 로고" width={72} height={24} priority />
          </Link>
          {user && (
            <span className="text-xl font-bold mt-1">{user.schoolName ?? '-'}</span>
          )}
        </div>
      </header>

      {/* 프로필 본문 */}
      <div className="px-4 pt-4 pb-20 max-w-lg mx-auto bg-gray-50 space-y-6">
        {/* 프로필 박스 */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
          {user ? (
            <div className="flex items-center gap-3">
             <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <Image
                src="/profile.png"
                alt="user icon"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
              <div className="text-sm leading-tight">
                <p className="font-semibold">
                  {user.name ?? '-'}
                  {user.nickname ? (
                    <span className="ml-2 text-xs text-blue-600">({user.nickname})</span>
                  ) : null}
                </p>
                <p className="text-gray-500">{user.schoolName ?? '-'}</p>
                <p className="text-gray-400 text-xs">{user.email ?? '-'}</p>
                <p className="text-gray-400 text-xs">
                  {(user.gradeNumber ? `${user.gradeNumber}학년 ` : '') +
                    (user.classNumber ? `${user.classNumber}반` : '')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-gray-400">로그인 정보를 불러올 수 없습니다.</div>
          )}
          <button onClick={handleEdit} className="text-sm text-blue-500 font-semibold">
            수정
          </button>
        </div>

        {/* 항목들 */}
        <div
          onClick={() => router.push('/profile/posts')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">나의 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div
          onClick={() => router.push('/profile/comments')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">나의 댓글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div
          onClick={() => router.push('/profile/scraps')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">스크랩한 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div
          onClick={() => router.push('/profile/likes')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">좋아요한 글</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div
          onClick={() => router.push('/profile/liked-comments')}
          className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
        >
          <p className="font-semibold text-sm">좋아요한 댓글</p>
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
