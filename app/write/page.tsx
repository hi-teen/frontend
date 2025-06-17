'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import BoardSelectModal from '../board/_component/BoardSelectModal';

const boards = [
  '전체게시판',
  '자유게시판',
  '비밀게시판',
  '정보게시판',
  '1학년게시판',
  '2학년게시판',
  '3학년게시판',
];

export default function PostWritePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState('게시판 선택');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (board: string) => {
    setFavorites((prev) =>
      prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]
    );
  };

  return (
    <div className="relative max-w-lg mx-auto bg-white min-h-screen pb-[128px]">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-base font-semibold">글쓰기</h1>
        <div className="w-5 h-5" />
      </div>

      {/* 게시판 선택 */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full text-left text-sm font-medium px-4 py-3 border rounded-lg text-gray-600"
        >
          {selectedBoard}
        </button>
      </div>

      {/* 제목 입력 */}
      <div className="px-4 mt-4">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full border-b text-sm py-2 outline-none"
        />
      </div>

      {/* 본문 입력 */}
      <div className="px-4 mt-4">
        <textarea
          placeholder="내용을 입력하세요"
          className="w-full min-h-[450px] text-sm p-3 border rounded-md outline-none"
        />
      </div>

      {/* 하단 고정 안내 문구 */}
      <div className="fixed bottom-[90px] left-0 right-0 px-4 z-40">
        <div className="text-xs text-gray-500 p-4 rounded-t-xl max-w-lg mx-auto">
          <ul className="list-disc pl-4 space-y-1">
            <li>욕설, 비하, 차별, 혐오, 음란물 등의 게시물 금지</li>
            <li>타인의 권리를 침해하거나 불쾌감을 줄 수 있는 내용 금지</li>
            <li>타인 사칭, 허위정보, 광고 게시물 금지</li>
          </ul>
        </div>
      </div>

      {/* 게시판 모달 */}
      <BoardSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selected={selectedBoard}
        onSelect={setSelectedBoard}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}
