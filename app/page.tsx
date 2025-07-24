'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';

import { accessTokenAtom } from '@/shared/stores/auth';
import { favoriteBoardsAtom } from '@/entities/auth/model/favoriteBoardsAtom';
import { fetchBoards, BoardItem } from '@/shared/api/board';

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

export default function HomePage() {
  const [accessToken] = useAtom(accessTokenAtom);
  const [favoriteBoards] = useAtom(favoriteBoardsAtom);

  const [boardPosts, setBoardPosts] = useState<Record<string, BoardItem[]>>({});
  const [selectedBoard, setSelectedBoard] = useState('FREE');

  const favoriteBoardMeta = allBoards.filter((board) =>
    favoriteBoards.includes(board.key)
  );

  useEffect(() => {
    async function fetchAndGroupPosts() {
      try {
        const all = await fetchBoards();
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
      <TodayMealContainer />
      <QuickMenu />
      {/* FavoriteBoardSection에 emoji 전달 */}
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
