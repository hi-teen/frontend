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
import PopupAd from './_component/PopupAd';

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
    }
  }, [favoriteBoards, selectedBoard]);

  // 토큰 자동 갱신 함수
  const refreshTokenIfNeeded = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const { accessToken: newAccessToken } = await reissueToken();
      setAccessToken(newAccessToken);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('토큰 갱신 실패:', error instanceof Error ? error.message : String(error));
      }
      return false;
    }
  };

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setMounted(true);
    
    // localStorage에서 모든 값 읽어오기
    if (typeof window !== 'undefined') {
      try {
        // favoriteBoards 설정 - 사용자별로 저장
        const userId = localStorage.getItem('userId');
        const favoriteBoardsKey = userId ? `favoriteBoards_${userId}` : 'favoriteBoards';
        const storedBoards = localStorage.getItem(favoriteBoardsKey);
        if (storedBoards) {
          const parsedBoards = JSON.parse(storedBoards);
          if (Array.isArray(parsedBoards) && parsedBoards.length > 0) {
            setFavoriteBoards(parsedBoards);
          }
        } else {
          // 운영: 빈 상태 유지. 필요 시 개발 환경에서만 기본값 설정
          if (process.env.NODE_ENV !== 'production') {
            setFavoriteBoards(['SECRET', 'INFORMATION']);
          } else {
            setFavoriteBoards([]);
          }
        }
        
        // accessToken 설정
        const token = localStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
        } else {
          // accessToken이 없으면 자동으로 갱신 시도
          refreshTokenIfNeeded();
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('localStorage 읽기 오류:', error instanceof Error ? error.message : String(error));
        }
        // 불량 데이터 정리 및 안전한 기본값 유지
        localStorage.removeItem('favoriteBoards');
        setFavoriteBoards([]);
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
        try {
          // 토큰이 유효한지 간단히 체크 (API 호출 없이)
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          const expiresIn = tokenPayload.exp - now;
          
          // 10분 이내에 만료되면 갱신
          if (expiresIn < 600) {
            await refreshTokenIfNeeded();
          }
        } catch (error) {
          // 토큰 상태 확인 실패 시 갱신 시도
          await refreshTokenIfNeeded();
        }
      }
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [mounted, refreshTokenIfNeeded]);

  // 페이지 포커스 시 토큰 상태 확인
  useEffect(() => {
    if (!mounted) return;

    const handleFocus = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        refreshTokenIfNeeded();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [mounted, refreshTokenIfNeeded]);

  // 게시판별 글 불러오기
  useEffect(() => {
    async function fetchAndGroupPosts() {
      if (!accessToken) {
        const refreshed = await refreshTokenIfNeeded();
        if (!refreshed) {
          setIsLoading(false);
          return;
        }
        // 갱신된 토큰으로 다시 시도
        return;
      }
      
      try {
        setIsLoading(true);
        const all = await fetchBoards();
        
        const grouped: Record<string, BoardItem[]> = {};
        favoriteBoards.forEach((key) => {
          const filtered = all.filter((item) => item.category === key);
          // 최신순으로 정렬 후 상위 3개 선택
          const sorted = filtered.sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          grouped[key] = sorted.slice(0, 3);
        });
        
        setBoardPosts(grouped);
        
        // 즐겨찾기 게시판이 있으면 첫 번째를 선택
        if (favoriteBoards.length > 0) {
          setSelectedBoard(favoriteBoards[0]);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('게시판 데이터 불러오기 실패:', error instanceof Error ? error.message : String(error));
        }
        // 401/403 오류 시 토큰 갱신 시도
        if (error instanceof Error && error.message.includes('401')) {
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) {
            // 갱신된 토큰으로 다시 시도
            return;
          }
        }
        setBoardPosts({});
      } finally {
        setIsLoading(false);
      }
    }

    if (mounted) {
      // accessToken이 있으면 API 호출, 없으면 기본 UI만 표시
      if (accessToken && favoriteBoards.length > 0) {
        fetchAndGroupPosts();
      } else {
        setIsLoading(false);
      }
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
        if (process.env.NODE_ENV !== 'production') {
          console.error('인기 게시물 불러오기 실패:', err instanceof Error ? err.message : String(err));
        }
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
    <>
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
      <PopupAd />
    </>
  );
}
