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
import { tokenStorage } from '@/shared/utils/safeStorage';
import { fetchMyProfile } from '@/shared/api/profile';

const SearchModal = dynamic(() => import('../../../app/_component/SearchModal'), {
  ssr: false,
}) as React.ComponentType<{ onClose: () => void }>;

interface Profile {
  id: number;
  name: string;
  email: string;
  gradeNumber: number;
  classNumber: number;
  school: {
    schoolName: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [lovedPosts, setLovedPosts] = useState<BoardItem[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleEdit = () => router.push('/profile/edit');
  const handleLogout = () => {
    tokenStorage.clearTokens();
    router.push('/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = tokenStorage.getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await fetchMyProfile();
        setProfile(data.data);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  return (
    <>
      <header className="px-4 pt-5 flex justify-between items-start bg-gray-50 sticky top-0 z-50">
        <div className="flex flex-col">
          <Link href="/"><Image src="/HiTeen.png" alt="로고" width={72} height={24} priority/></Link>
          {profile && <span className="text-xl font-bold mt-1">{profile.school.schoolName}</span>}
        </div>
      </header>

      <div className="px-4 pt-4 pb-20 max-w-lg mx-auto bg-gray-50 space-y-6">
        {/* 프로필 박스 */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
          {profile ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Image src="/profile.png" alt="유저아이콘" width={60} height={60}/>
              </div>
              <div className="text-sm leading-tight">
                <p className="font-semibold">{profile.name}</p>
                <p className="text-gray-500">{profile.school.schoolName}</p>
                <p className="text-gray-400 text-xs">{profile.email}</p>
                <p className="text-gray-400 text-xs">
                  {profile.gradeNumber}학년 {profile.classNumber}반
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-gray-400">로그인 정보를 불러올 수 없습니다.</div>
          )}
          <button onClick={handleEdit} className="text-sm text-blue-500 font-semibold">수정</button>
        </div>

        {/* 나의 글/댓글/스크랩/좋아요 */}
        {[
          ['나의 글', '/profile/posts'],
          ['나의 댓글', '/profile/comments'],
          ['스크랩한 글', '/profile/scraps'],
          ['좋아요한 글', '/profile/likes'],
        ].map(([label, path]) => (
          <div
            key={label}
            onClick={() => router.push(path)}
            className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer"
          >
            <p className="font-semibold text-sm">{label}</p>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </div>
        ))}

        {/* 고객 지원 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="font-semibold mb-2">고객 지원</p>
          <ul className="space-y-2 text-gray-600">
            <li
              onClick={() => router.push('/profile/community-policy')}
              className="hover:underline cursor-pointer"
            >
              커뮤니티 정책
            </li>
            <li
              onClick={() => router.push('/profile/youth-protection')}
              className="hover:underline cursor-pointer"
            >
              청소년 보호 정책
            </li>
            <li
              onClick={() => router.push('/profile/terms-of-service')}
              className="hover:underline cursor-pointer"
            >
              서비스 이용약관
            </li>
            <li
              onClick={() => router.push('/profile/faq')}
              className="hover:underline cursor-pointer"
            >
              이용문의
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="block w-full mt-6 py-3 text-center text-red-500 font-semibold border border-red-200 rounded-2xl bg-white hover:bg-red-50 transition"
        >
          로그아웃
        </button>
      </div>

      {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
    </>
  );
}
