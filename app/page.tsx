'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { favoriteBoardsAtom } from '@/entities/auth/model/favoriteBoardsAtom';

import HomeHeader from './_component/HomeHeader';
import TodayMealCard from './_component/TodayMealCard';
import QuickMenu from './_component/QuickMenu';
import FavoriteBoardSection from './_component/FavoriteBoardSection';
import HotPostSection from './_component/HotPostSection';

const allBoards = [
  { key: 'free', label: '자유게시판', icon: '/smile.png' },
  { key: 'secret', label: '비밀게시판', icon: '/secret.png' },
  { key: 'info', label: '정보게시판', icon: '/light.png' },
  { key: '1st', label: '1학년게시판', icon: '/first.png' },
];

// 게시판별 post 구조에 boardKey 추가
const posts = [
  { id: 1, title: '종강 6월 16일인가요?', likes: 1, comments: 13, boardKey: 'free' },
  { id: 2, title: '중간고사 점수 공유해요', likes: 3, comments: 5, boardKey: 'info' },
  { id: 3, title: '급식이 너무 맛없어요', likes: 0, comments: 7, boardKey: 'free' },
  { id: 4, title: '시험 기간 꿀팁 공유', likes: 12, comments: 8, boardKey: '1st' },
];

const hotPosts = [
  {
    id: 1,
    title: '기말고사 시험범위 정리',
    board: '시험정보',
    likes: 128,
    comments: 45,
  },
  {
    id: 2,
    title: '급식실 새 메뉴 리뷰',
    board: '자유게시판',
    likes: 98,
    comments: 32,
  },
  {
    id: 3,
    title: '교복 공동구매 하실 분',
    board: '장터게시판',
    likes: 76,
    comments: 28,
  },
];

export default function HomePage() {
  const today = new Date();
  const formattedDate = format(today, 'M월 d일 (EEEE)', { locale: ko });

  const [selected, setSelected] = useState('free');
  const [favorites] = useAtom(favoriteBoardsAtom); // 전역 상태 사용

  const favoriteBoards = allBoards.filter((board) => favorites.includes(board.key));
  const filteredPosts = posts.filter((post) => post.boardKey === selected);

  const monthMeals = [
    {
      date: formattedDate,
      lunch: ['백미밥', '된장국', '돈까스', '양배추샐러드', '깍두기', '딸기'],
      dinner: ['백미밥', '김치찌개', '고등어구이', '시금치나물', '김치'],
    },
    {
      date: '6월 6일 (목)',
      lunch: ['잡곡밥', '계란국', '제육볶음'],
      dinner: ['우동', '단무지'],
    },
    {
      date: '6월 7일 (금)',
      lunch: ['카레라이스', '오이무침'],
      dinner: ['김밥', '떡볶이'],
    },
    {
      date: '6월 8일 (토)',
      lunch: ['비빔밥', '미소된장국'],
      dinner: ['짜장면', '단무지'],
    },
    {
      date: '6월 9일 (일)',
      lunch: ['볶음밥', '계란국'],
      dinner: ['삼겹살', '상추'],
    },
  ];

  return (
    <main className="pb-16 max-w-lg mx-auto">
      <HomeHeader />
      <TodayMealCard monthMeals={monthMeals} />
      <QuickMenu />
      <FavoriteBoardSection
        boards={favoriteBoards}
        posts={filteredPosts}
        selected={selected}
        setSelected={setSelected}
      />
      <HotPostSection posts={hotPosts} />
    </main>
  );
}
