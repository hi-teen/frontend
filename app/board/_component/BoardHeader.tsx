'use client';

import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Props {
  selected: string;
  onOpen: () => void;
  favorites: string[];
  toggleFavorite: (board: string) => void;
}

export default function BoardHeader({
  selected,
  onOpen,
  favorites,
  toggleFavorite,
}: Props) {
  const isFavorite = favorites.includes(selected);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // onOpen 방지
    toggleFavorite(selected);
  };

  return (
    <header className="px-4 pt-5 pb-3 bg-gray-50 sticky top-0 z-50 m-2">
      <div className="flex justify-between items-center">
        {/* 게시판 선택 버튼 */}
        <button
          className="text-xl font-bold flex items-center gap-1"
          onClick={onOpen}
        >
          <span onClick={handleStarClick}>
            {isFavorite ? (
              <StarSolid className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarOutline className="w-5 h-5 text-yellow-400" />
            )}
          </span>
          {selected}
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-center gap-4">
          <PlusIcon className="w-6 h-6 text-gray-400" />
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
          <div className="relative">
            <BellIcon className="w-6 h-6 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              6
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
