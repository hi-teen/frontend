'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface BoardSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (board: string) => void;
  favorites: string[];
  toggleFavorite: (board: string) => void;
}

const boards = [
  '전체게시판',
  '자유게시판',
  '비밀게시판',
  '정보게시판',
  '1학년게시판',
  '2학년게시판',
  '3학년게시판',
];

export default function BoardSelectModal({
  isOpen,
  onClose,
  selected,
  onSelect,
  favorites,
  toggleFavorite,
}: BoardSelectModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 어둡게 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 슬라이드업 패널 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-4 pb-6 px-5 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">게시판 선택</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <ul className="space-y-3">
          {boards.map((board) => {
            const isFavorite = favorites.includes(board);
            return (
              <li
                key={board}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-xl"
                onClick={() => {
                  onSelect(board);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(board);
                    }}
                  >
                    {isFavorite ? (
                      <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      selected === board ? 'font-bold text-blue-500' : 'text-gray-800'
                    }`}
                  >
                    {board}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
