'use client';

import { atom } from 'jotai';

export interface SignupFormData {
  name: string;
  nickname: string;
  school: string;
  gradeNumber: number;
  classNumber: number;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const signupAtom = atom<SignupFormData>({
  name: '',
  nickname: '',
  school: '',
  gradeNumber: 0,
  classNumber: 0,
  email: '',
  password: '',
  passwordConfirm: '',
});
