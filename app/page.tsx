'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import { accessTokenAtom } from '@/shared/stores/auth';
import { favoriteBoardsAtom } from '@/entities/auth/model/favoriteBoardsAtom';
import { fetchBoards, BoardItem, fetchPopularBoards } from '@/shared/api/board';
import { reissueToken } from '@/shared/api/auth';

import HomeHeader from './_component/HomeHeader';
import TodayMealContainer from './_component/TodayMealContainer';
import QuickMenu from './_component/QuickMenu';
import FavoriteBoardSection from './_component/FavoriteBoardSection';
import HotPostSection from './_component/HotPostSection';

const allBoards = [
  { key: 'FREE', label: '자유게시판', emoji: '😊' },
  { key: 'SECRET', label: '비밀게시판', emoji: '🤫' },
  { key: 'PROMOTION', label: '홍보게시판', emoji: '📢' },
  { key: 'INFORMATION', label: '정보게시판', emoji: '💡' },
  { key: 'GRADE1', label: '1학년게시판', emoji: '1️⃣' },
  { key: 'GRADE2', label: '2학년게시판', emoji: '2️⃣' },
  { key: 'GRADE3', label: '3학년게시판', emoji: '3️⃣' },
];

interface HotPost {
  id: number;
  title: string;
  board: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  date: string;
}

export default function HomePage() {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [favoriteBoards, setFavoriteBoards] = useAtom(favoriteBoardsAtom);

  const [boardPosts, setBoardPosts] = useState<Record<string, BoardItem[]>>({});
  const [selectedBoard, setSelectedBoard] = useState<string>('FREE');
  const [hotPosts, setHotPosts] = useState<HotPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const favoriteBoardMeta = allBoards.filter((board) =>
    favoriteBoards.includes(board.key)
  );

  // selectedBoard를 favoriteBoards의 첫 번째 값으로 설정
  useEffect(() => {
    if (favoriteBoards.length > 0 && selectedBoard === 'FREE') {
      setSelectedBoard(favoriteBoards[0]);
      console.log('🎯 selectedBoard 업데이트:', favoriteBoards[0]);
    }
  }, [favoriteBoards, selectedBoard]);

  // accessToken 디버깅
  console.log('🔑 accessToken 상태:', {
    accessToken: !!accessToken,
    accessTokenValue: accessToken,
    accessTokenType: typeof accessToken,
    accessTokenLength: accessToken?.length || 0
  });

  // 토큰 자동 갱신 함수
  const refreshTokenIfNeeded = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('❌ refreshToken이 없음');
        return false;
      }

      console.log('🔄 토큰 자동 갱신 시도');
      const { accessToken: newAccessToken } = await reissueToken();
      console.log('✅ 토큰 갱신 성공');
      setAccessToken(newAccessToken);
      return true;
    } catch (error) {
      console.error('❌ 토큰 갱신 실패:', error);
      return false;
    }
  };

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setMounted(true);
    
    // localStorage에서 모든 값 읽어오기
    if (typeof window !== 'undefined') {
      try {
        // favoriteBoards 설정
        const storedBoards = localStorage.getItem('favoriteBoards');
        console.log('💾 localStorage에서 읽은 favoriteBoards:', storedBoards);
        if (storedBoards) {
          const parsedBoards = JSON.parse(storedBoards);
          console.log('🔧 파싱된 favoriteBoards:', parsedBoards);
          if (Array.isArray(parsedBoards) && parsedBoards.length > 0) {
            console.log('✅ favoriteBoards 설정:', parsedBoards);
            setFavoriteBoards(parsedBoards);
          }
        } else {
          // 임시 테스트: 하드코딩된 값으로 설정
          console.log('🧪 임시 테스트: 하드코딩된 favoriteBoards 설정');
          setFavoriteBoards(['SECRET', 'INFORMATION']);
        }
        
        // accessToken 설정
        const token = localStorage.getItem('accessToken');
        console.log('🔑 localStorage에서 읽은 accessToken:', token ? `${token.substring(0, 20)}...` : null);
        if (token) {
          console.log('✅ accessToken 설정');
          setAccessToken(token);
        } else {
          console.log('❌ accessToken이 localStorage에 없음 - 자동 갱신 시도');
          // accessToken이 없으면 자동으로 갱신 시도
          refreshTokenIfNeeded();
        }
      } catch (error) {
        console.error('❌ localStorage 읽기 오류:', error);
        // 오류 시에도 임시 값 설정
        setFavoriteBoards(['SECRET', 'INFORMATION']);
      }
    }
  }, [setFavoriteBoards, setAccessToken]);

  // 주기적 토큰 갱신 (5분마다)
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        console.log('⏰ 주기적 토큰 갱신 체크');
        try {
          // 토큰이 유효한지 간단히 체크 (API 호출 없이)
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          const expiresIn = tokenPayload.exp - now;
          
          // 10분 이내에 만료되면 갱신
          if (expiresIn < 600) {
            console.log('⚠️ 토큰 만료 임박 - 자동 갱신');
            await refreshTokenIfNeeded();
          }
        } catch (error) {
          console.log('🔄 토큰 상태 확인 실패 - 갱신 시도');
          await refreshTokenIfNeeded();
        }
      }
    }, 5 * 60 * 1000); // 5분마다

    return () => clearInterval(interval);
  }, [mounted, refreshTokenIfNeeded]);

  // 페이지 포커스 시 토큰 상태 확인
  useEffect(() => {
    if (!mounted) return;

    const handleFocus = () => {
      console.log('📱 페이지 포커스 - 토큰 상태 확인');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('🔄 포커스 시 토큰 갱신 시도');
        refreshTokenIfNeeded();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [mounted, refreshTokenIfNeeded]);

  // 게시판별 글 불러오기
  useEffect(() => {
    async function fetchAndGroupPosts() {
      console.log('🔍 fetchAndGroupPosts 실행:', {
        accessToken: !!accessToken,
        favoriteBoards,
        favoriteBoardsLength: favoriteBoards.length
      });

      if (!accessToken) {
        console.log('❌ accessToken이 없음 - 자동 갱신 시도');
        const refreshed = await refreshTokenIfNeeded();
        if (!refreshed) {
          console.log('❌ 토큰 갱신 실패');
          setIsLoading(false);
          return;
        }
        // 갱신된 토큰으로 다시 시도
        console.log('🔄 토큰 갱신 후 다시 시도');
        return;
      }
      
      try {
        setIsLoading(true);
        const all = await fetchBoards();
        console.log('📚 fetchBoards 결과:', all.length, '개');
        
        const grouped: Record<string, BoardItem[]> = {};
        favoriteBoards.forEach((key) => {
          const filtered = all.filter((item) => item.category === key);
          grouped[key] = filtered.slice(0, 3);
          console.log(`📋 ${key} 게시판:`, filtered.length, '개 중', grouped[key].length, '개 표시');
        });
        
        setBoardPosts(grouped);
        console.log('🎯 최종 grouped 결과:', grouped);
        
        // 즐겨찾기 게시판이 있으면 첫 번째를 선택
        if (favoriteBoards.length > 0) {
          setSelectedBoard(favoriteBoards[0]);
          console.log('⭐ 선택된 게시판:', favoriteBoards[0]);
        }
      } catch (error) {
        console.error('❌ 게시판 데이터 불러오기 실패:', error);
        // 401/403 오류 시 토큰 갱신 시도
        if (error instanceof Error && error.message.includes('401')) {
          console.log('🔄 401 오류 - 토큰 갱신 시도');
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) {
            // 갱신된 토큰으로 다시 시도
            console.log('🔄 토큰 갱신 후 다시 시도');
            return;
          }
        }
        setBoardPosts({});
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted && favoriteBoards.length > 0) {
      // accessToken이 있으면 API 호출, 없으면 기본 UI만 표시
      if (accessToken) {
        fetchAndGroupPosts();
      } else {
        console.log('⚠️ accessToken 없음 - 기본 UI만 표시');
        setIsLoading(false);
      }
    } else {
      console.log('🚫 fetchAndGroupPosts 실행 조건 미충족:', {
        mounted,
        accessToken: !!accessToken,
        favoriteBoardsLength: favoriteBoards.length
      });
    }
  }, [mounted, accessToken, favoriteBoards, setSelectedBoard]);

  // 인기 게시물 불러오기
  useEffect(() => {
    async function fetchHotPosts() {
      try {
        const data = await fetchPopularBoards();
        setHotPosts(
          (data ?? []).slice(0, 3).map((item) => ({
            id: item.id,
            title: item.title,
            board: item.categoryLabel,
            content: item.content,
            likes: item.loveCount,
            comments: item.commentCount ?? 0,
            views: item.viewCount ?? 0,
            date: item.createdAt,
          }))
        );
      } catch (err) {
        console.error('🔥 인기 게시물 불러오기 실패:', err);
        setHotPosts([]);
      }
    }
    fetchHotPosts();
  }, [accessToken]);

  // 서버 사이드 렌더링 중에는 기본 레이아웃만 표시
  if (!mounted) {
    return (
      <main className="pb-16 max-w-lg mx-auto">
        <div className="h-8 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="h-32 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="h-24 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="h-32 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="h-32 bg-gray-100 animate-pulse rounded mb-4" />
      </main>
    );
  }

  // 로딩 중일 때 기본 UI 표시
  if (isLoading && accessToken) {
    return (
      <main className="pb-16 max-w-lg mx-auto">
        <HomeHeader />
        <TodayMealContainer />
        <QuickMenu />
        <div className="p-4 text-center text-gray-500">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="pb-16 max-w-lg mx-auto">
      <HomeHeader />
      <TodayMealContainer />
      <QuickMenu />
      <FavoriteBoardSection
        boards={favoriteBoardMeta}
        posts={boardPosts}
        selected={selectedBoard}
        setSelected={setSelectedBoard}
      />
      <HotPostSection posts={hotPosts} />
    </main>
  );
}
