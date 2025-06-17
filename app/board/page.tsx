'use client';

import { useState } from 'react';
import BoardHeader from './_component/BoardHeader';
import PostList from './_component/PostList';
import BoardSelectModal from './_component/BoardSelectModal';

const boards = [
  '전체게시판',
  '자유게시판',
  '비밀게시판',
  '정보게시판',
  '1학년게시판',
  '2학년게시판',
  '3학년게시판',
];

const dummyPosts = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  title: '기말고사 시험 범위 정리',
  content: '기말고사 시험범위 딱 정리해준다. 수학 어쩌구 영어 어쩌구...',
  board: '자유게시판',
  likes: 50,
  comments: 27,
  views: 132,
}));

export default function BoardPage() {
  const [selected, setSelected] = useState('전체게시판');
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (board: string) => {
    setFavorites((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
  };

  return (
    <main className="max-w-lg mx-auto bg-gray-50 pb-24">
      <BoardHeader
        selected={selected}
        onOpen={() => setOpen(true)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <PostList posts={dummyPosts} />
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
