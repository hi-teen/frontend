'use client';
import { atom } from 'jotai';

export const userAtom = atom<{ email: string } | null>(null);