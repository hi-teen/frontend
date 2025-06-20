'use client';

import { useState } from 'react';
import BoardHeader from './_component/BoardHeader';
import PostList from './_component/PostList';
import BoardSelectModal from './_component/BoardSelectModal';

const dummyPosts = [
  {
    id: 1,
    title: '기말고사 시험 범위 정리',
    content: '수학, 영어 시험범위 정리해드립니다.',
    board: '자유게시판',
    likes: 50,
    comments: 27,
    views: 132,
  },
  {
    id: 2,
    title: '고3 시간표 공유',
    content: '3학년 수업시간표 참고하세요.',
    board: '3학년게시판',
    likes: 20,
    comments: 3,
    views: 50,
  },
  {
    id: 3,
    title: '학교 행사 안내',
    content: '이번 주 체육대회 일정 안내입니다.',
    board: '정보게시판',
    likes: 30,
    comments: 5,
    views: 75,
  },
  // 필요 시 더 추가 가능
];

export default function BoardPage() {
  const [selected, setSelected] = useState('전체게시판');
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (board: string) => {
    setFavorites((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
  };

  const filteredPosts =
    selected === '전체'
      ? dummyPosts
      : dummyPosts.filter((post) => post.board === selected);

  return (
    <main className="max-w-lg mx-auto bg-gray-50 pb-24">
      <BoardHeader
        selected={selected}
        onOpen={() => setOpen(true)}
        onSelectBoard={(board) => setSelected(board)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <PostList posts={filteredPosts} />
      <BoardSelectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        selected={selected}
        onSelect={(board) => {
          setSelected(board);
          setOpen(false);
        }}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </main>
  );
}
