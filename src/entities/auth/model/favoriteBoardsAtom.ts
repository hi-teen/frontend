'use client';

import { atom } from 'jotai';
import { safeStorage, safeJsonParse } from '@/shared/utils/safeStorage';

// 안전한 localStorage 접근을 위한 기본값
const getDefaultFavoriteBoards = (): string[] => {
  const stored = safeStorage.localStorage.getItem('favoriteBoards');
  return safeJsonParse(stored, []);
};

// 업데이트 시 안전하게 localStorage에 동기화되는 write-atom 래핑
const _favoriteBoardsBaseAtom = atom<string[]>(getDefaultFavoriteBoards());
export const favoriteBoardsAtom = atom(
  (get) => get(_favoriteBoardsBaseAtom),
  (get, set, next: string[] | ((prev: string[]) => string[])) => {
    const prev = get(_favoriteBoardsBaseAtom);
    const value = typeof next === 'function' ? (next as (p: string[]) => string[])(prev) : next;
    set(_favoriteBoardsBaseAtom, value);
    safeStorage.localStorage.setItem('favoriteBoards', JSON.stringify(value));
  }
);
