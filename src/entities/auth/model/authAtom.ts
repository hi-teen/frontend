'use client';

import { atom, useAtom } from 'jotai';

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  nickname: string;
  schoolId: number;
  gradeNumber: number;
  classNumber: number;
}

export const userAtom = atom<UserInfo | null>(null);

export const useUserAtom = () => useAtom(userAtom);