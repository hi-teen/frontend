'use client';

import { atom } from 'jotai';

// 즐겨찾기 게시판 (읽기/쓰기 가능)
export const favoriteBoardsAtom = atom<string[]>([]);

// 사용자별 즐겨찾기 게시판 저장 함수
export const saveFavoriteBoards = (boards: string[]) => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    const key = userId ? `favoriteBoards_${userId}` : 'favoriteBoards';
    localStorage.setItem(key, JSON.stringify(boards));
  }
};
