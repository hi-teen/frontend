'use client';
import { atom } from 'jotai';

// 토큰 (로그인 이후 서버가 응답한다면)
export const accessTokenAtom = atom<string | null>(null);

// 로그인한 사용자 정보
export const authUserAtom = atom<{
  email: string;
  name: string;
  schoolId: number;
  gradeNumber: number;
  classNumber: number;
} | null>(null);
