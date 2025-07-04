'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAtom } from 'jotai';

import { accessTokenAtom } from '@/shared/stores/auth';
import { favoriteBoardsAtom } from '@/entities/auth/model/favoriteBoardsAtom';
import { fetchBoards, BoardItem } from '@/shared/api/board';

import HomeHeader from './_component/HomeHeader';
import TodayMealCard from './_component/TodayMealCard';
import QuickMenu from './_component/QuickMenu';
import FavoriteBoardSection from './_component/FavoriteBoardSection';
import HotPostSection from './_component/HotPostSection';

interface Meal {
  date: string;
  lunch: string[];
  dinner: string[];
}

const allBoards = [
  { key: 'FREE', label: '자유게시판', icon: '/smile.png' },
  { key: 'SECRET', label: '비밀게시판', icon: '/secret.png' },
  { key: 'PROMOTION', label: '홍보게시판', icon: '/promotion.png' },
  { key: 'INFORMATION', label: '정보게시판', icon: '/light.png' },
  { key: 'GRADE1', label: '1학년게시판', icon: '/first.png' },
  { key: 'GRADE2', label: '2학년게시판', icon: '/second.png' },
  { key: 'GRADE3', label: '3학년게시판', icon: '/third.png' },
];

export default function HomePage() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [favoriteBoards] = useAtom(favoriteBoardsAtom);

  const [monthMeals, setMonthMeals] = useState<Meal[]>([]);
  const [boardPosts, setBoardPosts] = useState<Record<string, BoardItem[]>>({});
  const [selectedBoard, setSelectedBoard] = useState('FREE'); // key(영문) 기준

  // 즐겨찾는 게시판 meta 정보(key = 영문 코드)
  const favoriteBoardMeta = allBoards.filter((board) =>
    favoriteBoards.includes(board.key)
  );

  useEffect(() => {
    console.log("accessToken:", accessToken);
    console.log("favoriteBoards:", favoriteBoards);
  
    async function fetchAndGroupPosts() {
      // 임시로 조건문 주석처리
      // if (!accessToken) return;
  
      try {
        const all = await fetchBoards();
        console.log("불러온 전체 게시글:", all);
  
        const grouped: Record<string, BoardItem[]> = {};
        favoriteBoards.forEach((key) => {
          grouped[key] = all.filter((item) => item.category === key).slice(0, 3);
        });
  
        setBoardPosts(grouped);
      } catch (error) {
        console.error('❌ 게시판 데이터 불러오기 실패:', error);
      }
    }
  
    fetchAndGroupPosts();
  }, [accessToken, favoriteBoards]);
  

  return (
    <main className="pb-16 max-w-lg mx-auto">
      <HomeHeader />
      <TodayMealCard monthMeals={monthMeals} />
      <QuickMenu />
      <FavoriteBoardSection
        boards={favoriteBoardMeta}
        posts={boardPosts}
        selected={selectedBoard}
        setSelected={setSelectedBoard}
      />
      <HotPostSection posts={[]} />
    </main>
  );
}
