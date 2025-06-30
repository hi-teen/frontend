'use client';

import { atomWithStorage } from 'jotai/utils';

export const favoriteBoardsAtom = atomWithStorage<string[]>('favoriteBoards', []);
