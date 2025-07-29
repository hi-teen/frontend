'use client';

import { atom } from 'jotai';

export const signupFormAtom = atom({
  name: '',
  schoolId: 0,
  schoolName: '', 
  gradeNumber: 0,
  classNumber: 0,
  email: '',
  password: '',
  passwordConfirm: '',
});
