'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const boards = ['전체게시판', '자유게시판', '비밀게시판', '정보게시판', '1학년게시판', '2학년게시판', '3학년게시판'];

export default function BoardHeader() {
  const [selected, setSelected] = useState('전체게시판');
  const [open, setOpen] = useState(false);

  return (
    <header className="px-4 pt-5 pb-3 bg-gray-50 sticky top-0 z-50 m-2">
      <div className="flex justify-between items-center">
        {/* 게시판 선택 드롭다운 */}
        <div className="relative">
          <button
            className="text-xl font-bold flex items-center gap-1"
            onClick={() => setOpen((prev) => !prev)}
          >
            {selected}
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>
          {open && (
            <ul className="absolute mt-2 w-40 bg-white border rounded-md shadow z-50">
              {boards.map((board) => (
                <li
                  key={board}
                  onClick={() => {
                    setSelected(board);
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {board}
                </li>
              ))}
            </ul>
          )}
        </div>

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
