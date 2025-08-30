'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { favoriteBoardsAtom, saveFavoriteBoards } from '@/entities/auth/model/favoriteBoardsAtom';

interface BoardOption {
  key: string;
  label: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (label: string) => void;
}

const boardOptions: BoardOption[] = [
  { key: 'FREE', label: '자유게시판' },
  { key: 'SECRET', label: '비밀게시판' },
  { key: 'INFORMATION', label: '정보게시판' },
  { key: 'GRADE1', label: '1학년게시판' },
  { key: 'GRADE2', label: '2학년게시판' },
  { key: 'GRADE3', label: '3학년게시판' },
];

export default function BoardSelectModal({
  isOpen,
  onClose,
  selected,
  onSelect,
}: Props) {
  const [favoriteBoards, setFavoriteBoards] = useAtom(favoriteBoardsAtom);

  const toggleFavorite = (key: string) => {
    setFavoriteBoards((prev) => {
      const newBoards = prev.includes(key) 
        ? prev.filter((k) => k !== key) 
        : [...prev, key];
      saveFavoriteBoards(newBoards);
      return newBoards;
    });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-end justify-center">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="w-full max-w-md mx-auto rounded-t-2xl bg-white p-4 pb-8 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <Dialog.Title className="text-lg font-bold">게시판 선택</Dialog.Title>
                <button onClick={onClose}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <ul className="space-y-2">
                {boardOptions.map((board) => (
                  <li
                  key={board.key}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-2 ${
                    selected === board.label ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    onSelect(board.key); // board.label 대신 board.key 전달
                    onClose();
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(board.key);
                    }}
                    className={`text-lg mr-1 ${
                      favoriteBoards.includes(board.key)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    aria-label="즐겨찾기"
                    tabIndex={-1}
                    type="button"
                  >
                    ★
                  </button>
                  <span className="flex-1 text-base">{board.label}</span>
                </li>
                
                ))}
              </ul>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
