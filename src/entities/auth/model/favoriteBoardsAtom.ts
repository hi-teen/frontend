'use client';

import { atom } from 'jotai';
import { safeStorage, safeJsonParse } from '@/shared/utils/safeStorage';

// 안전한 localStorage 접근을 위한 기본값
const getDefaultFavoriteBoards = (): string[] => {
  const stored = safeStorage.localStorage.getItem('favoriteBoards');
  return safeJsonParse(stored, []);
};

export const favoriteBoardsAtom = atom<string[]>(getDefaultFavoriteBoards());
