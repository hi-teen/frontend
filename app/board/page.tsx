'use client';

import { useEffect, useState } from 'react';
import BoardHeader from './_component/BoardHeader';
import PostList from './_component/PostList';
import BoardSelectModal from './_component/BoardSelectModal';
import { fetchBoards } from '@/shared/api/board';
import { useAtomValue, useSetAtom } from 'jotai';
import { boardListAtom } from '@/entities/auth/model/boardAtom';

export default function BoardPage() {
  const [selected, setSelected] = useState('ALL'); // key 기준!
  const [open, setOpen] = useState(false);

  const setBoards = useSetAtom(boardListAtom);
  const allBoards = useAtomValue(boardListAtom);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await fetchBoards();
        setBoards(data);
      } catch (e) {
        console.error('[게시글 목록 불러오기 오류]', e);
      }
    };
    loadBoards();
  }, [setBoards]);

  // 필터링은 무조건 영문 key 기준
  const filteredPosts =
    selected === 'ALL'
      ? allBoards
      : allBoards.filter((post) => post.category === selected);

  return (
    <main className="max-w-lg mx-auto bg-gray-50 pb-24">
      <BoardHeader
        selected={selected}
        onOpen={() => setOpen(true)}
        onSelectBoard={(key) => setSelected(key)}
      />
      <PostList posts={filteredPosts} selectedBoard={selected} />
      <BoardSelectModal
        isOpen={open}
        onClose={() => setOpen(false)}
        selected={selected}
        onSelect={(key) => {
          setSelected(key);
          setOpen(false);
        }}
      />
    </main>
  );
}
