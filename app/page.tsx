'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import HomeHeader from './_component/HomeHeader';
import TodayMealCard from './_component/TodayMealCard';
import QuickMenu from './_component/QuickMenu';
import FavoriteBoardSection from './_component/FavoriteBoardSection';
import HotPostSection from './_component/HotPostSection';
import PromotionBannerSection from './_component/PromotionBannerSection';

const boards = [
  { key: 'free', label: '자유게시판', icon: '/smile.png' },
  { key: 'secret', label: '비밀게시판', icon: '/secret.png' },
  { key: 'info', label: '정보게시판', icon: '/light.png' },
  { key: '1st', label: '1학년게시판', icon: '/first.png' },
];

const posts = [
  { id: 1, title: '종강 6월 16일인가요?', likes: 1, comments: 13 },
  { id: 2, title: '중간고사 점수 공유해요', likes: 3, comments: 5 },
  { id: 3, title: '급식이 너무 맛없어요', likes: 0, comments: 7 },
  { id: 4, title: '시험 기간 꿀팁 공유', likes: 12, comments: 8 },
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

  const todayMeals = {
    lunch: ['백미밥', '된장국', '돈까스', '양배추샐러드', '깍두기', '딸기'],
    dinner: ['백미밥', '김치찌개', '고등어구이', '시금치나물', '김치'],
  };

  return (
    <main className='pb-16 max-w-lg mx-auto'>
      <HomeHeader />
      <TodayMealCard todayMeals={todayMeals} formattedDate={formattedDate} />
      <QuickMenu />
      <FavoriteBoardSection
        boards={boards}
        posts={posts}
        selected={selected}
        setSelected={setSelected}
      />
      <HotPostSection posts={hotPosts} />
      <PromotionBannerSection />
    </main>
  );
}
