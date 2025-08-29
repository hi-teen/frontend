'use client';

import { atom } from 'jotai';

// 즐겨찾기 게시판 (읽기/쓰기 가능)
export const favoriteBoardsAtom = atom<string[]>([]);
