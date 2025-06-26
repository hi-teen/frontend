'use client';

import { atom } from 'jotai';

export interface UserInfo {
  email: string;
  name: string;
  nickname: string;
  school: string;
  gradeNumber: number;
  classNumber: number;
}

export const userAtom = atom<UserInfo | null>(null);
