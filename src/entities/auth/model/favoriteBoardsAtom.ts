'use client';

import { atom } from 'jotai';

export const favoriteBoardsAtom = atom<string[]>(['free', 'info']);
