import { atom } from 'jotai';
import type { BoardItem } from '@/shared/api/board';

export const boardListAtom = atom<BoardItem[]>([]);