'use client';

import { atom } from 'jotai';

export const signupFormAtom = atom({
  name: '',
  school: '',
  gradeNumber: 0,
  classNumber: 0,
  email: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
});
