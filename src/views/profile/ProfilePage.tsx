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
import { fetchMyReferralCode, fetchReferredMembers } from '@/shared/api/auth';
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
  const [referralCode, setReferralCode] = useState<string>('');
  const [referredCount, setReferredCount] = useState<number>(0);
  const [referralLoading, setReferralLoading] = useState(true);

  const handleEdit = () => router.push('/profile/edit');
  const handleLogout = () => {
    tokenStorage.clearTokens();
    router.push('/login');
  };

  const handleCopyReferralCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      alert('추천코드가 복사되었습니다!');
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement('textarea');
      textArea.value = referralCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('추천코드가 복사되었습니다!');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data.data);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        // 토큰 관련 에러인 경우에만 로그인 페이지로 이동
        if (error instanceof Error && (
          error.message.includes('토큰') || 
          error.message.includes('401') || 
          error.message.includes('403')
        )) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const [code, referredData] = await Promise.all([
          fetchMyReferralCode(),
          fetchReferredMembers()
        ]);
        
        setReferralCode(code);
        setReferredCount(referredData.count);
      } catch (error) {
        console.error('추천코드 데이터 조회 실패:', error);
        // 추천코드 조회 실패는 치명적이지 않으므로 기본값 유지
        setReferralCode('');
        setReferredCount(0);
      } finally {
        setReferralLoading(false);
      }
    };

    fetchReferralData();
  }, []);

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

        {/* 추천코드 섹션 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">내 추천코드</p>
            <span className="text-xs text-gray-500">🎁</span>
          </div>
          
          {referralLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-sm text-gray-700">
                    {referralCode || '추천코드가 없습니다'}
                  </span>
                </div>
                {referralCode && (
                  <button
                    onClick={handleCopyReferralCode}
                    className="px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    복사
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>내가 추천한 친구</span>
                <span className="font-semibold text-blue-500">{referredCount}명</span>
              </div>
            </div>
          )}
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
