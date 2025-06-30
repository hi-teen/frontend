'use client';

import { useEffect, useState } from 'react';
import BoardHeader from './_component/BoardHeader';
import PostList from './_component/PostList';
import BoardSelectModal from './_component/BoardSelectModal';
import { fetchBoards } from '@/shared/api/board';
import { useAtomValue, useSetAtom } from 'jotai';
import { boardListAtom } from '@/entities/auth/model/boardAtom';

export default function BoardPage() {
  const [selected, setSelected] = useState('전체');
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const setBoards = useSetAtom(boardListAtom);
  const allBoards = useAtomValue(boardListAtom);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data); // 서버에서 받은 board 값도 이미 한글이어야 함
      } catch (e) {
        console.error('[게시글 목록 불러오기 오류]', e);
      }
    };

    loadBoards();
  }, [setBoards]);

  const filteredPosts =
    selected === '전체'
      ? allBoards
      : allBoards.filter((post) => post.board === selected);

      const toggleFavorite = (board: string) => {
        setFavorites((prev) => {
          const updated = prev.includes(board)
            ? prev.filter((b) => b !== board)
            : [...prev, board];
          localStorage.setItem('favoriteBoards', JSON.stringify(updated));
          return updated;
        });
      };      

  return (
    <main className="max-w-lg mx-auto bg-gray-50 pb-24">
      <BoardHeader
        selected={selected}
        onOpen={() => setOpen(true)}
        onSelectBoard={(board) => setSelected(board)}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <PostList posts={filteredPosts} selectedBoard={selected} />
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
