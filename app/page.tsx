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
  { key: '자유게시판', label: '자유게시판', icon: '/smile.png' },
  { key: '비밀게시판', label: '비밀게시판', icon: '/secret.png' },
  { key: '정보게시판', label: '정보게시판', icon: '/light.png' },
  { key: '1학년게시판', label: '1학년게시판', icon: '/first.png' },
  { key: '2학년게시판', label: '2학년게시판', icon: '/second.png' },
  { key: '3학년게시판', label: '3학년게시판', icon: '/third.png' },
];

export default function HomePage() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [favoriteBoards] = useAtom(favoriteBoardsAtom);

  const [monthMeals, setMonthMeals] = useState<Meal[]>([]);
  const [boardPosts, setBoardPosts] = useState<Record<string, BoardItem[]>>({});
  const [selectedBoard, setSelectedBoard] = useState('자유게시판');

  const favoriteBoardMeta = allBoards.filter((board) =>
    favoriteBoards.includes(board.key)
  );

  useEffect(() => {
    async function fetchMeals() {
      if (!accessToken) return;

      try {
        const res = await axios.get('https://hiteen.site/api/v1/school-meal', {
          params: {
            officeCode: 'B10',
            schoolCode: '7010117',
            year: 2025,
            month: 6,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = res.data?.data || {};
        const parsedMeals = Object.entries(data).map(([dateStr, meals]) => {
          const parsedDate = parse(dateStr, 'yyyyMMdd', new Date());
          const formattedDate = format(parsedDate, 'M월 d일 (EEE)', { locale: ko });

          return {
            date: formattedDate,
            lunch: meals as string[],
            dinner: [],
          };
        });

        setMonthMeals(parsedMeals);
      } catch (error) {
        console.error('❌ 급식 데이터 불러오기 실패:', error);
      }
    }

    async function fetchAndGroupPosts() {
      if (!accessToken) return;

      try {
        const all = await fetchBoards();
        const grouped: Record<string, BoardItem[]> = {};

        favoriteBoards.forEach((label) => {
          grouped[label] = all.filter((item) => item.board === label);
        });

        setBoardPosts(grouped);
      } catch (error) {
        console.error('❌ 게시판 데이터 불러오기 실패:', error);
      }
    }

    fetchMeals();
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
