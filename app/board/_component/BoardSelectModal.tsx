'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (board: string) => void;
  favorites: string[];
  toggleFavorite: (board: string) => void;
}

const boardLabels = [
  '전체',
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
}: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="w-80 rounded-lg bg-white p-4">
          <div className="flex justify-between items-center mb-2">
            <Dialog.Title className="text-lg font-bold">게시판 선택</Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2">
            {boardLabels.map((label) => (
              <li
                key={label}
                className={`p-2 rounded-md cursor-pointer ${
                  selected === label ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelect(label)}
              >
                <div className="flex justify-between items-center">
                  <span>{label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(label);
                    }}
                    className={`text-sm ${
                      favorites.includes(label) ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
