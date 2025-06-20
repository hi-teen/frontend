'use client';

import { signupAtom } from '../../entities/auth/model/signupAtom';

export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  school: string;
  gradeNumber: number;
  classNumber: number;
}

// 로그인 API
export const loginApi = async (email: string, password: string): Promise<string> => {
    try {
      console.log('[로그인 요청 데이터]', { email, password });
  
      const res = await fetch('https://hiteen.site/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키 기반 인증 사용 시
        body: JSON.stringify({ email, password }),
      });
  
      console.log('[로그인 응답 상태]', res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[로그인 실패 응답]', errorText);
        throw new Error('로그인 실패');
      }
  
      const token = await res.text();
      console.log('[로그인 성공 - 토큰]', token);
  
      localStorage.setItem('accessToken', token);
      return token;
    } catch (error) {
      console.error('[로그인 중 오류 발생]', error);
      throw error;
    }
  };
  

// 내 정보 가져오기
export const fetchMe = async (): Promise<{ email: string }> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('유저 정보 가져오기 실패');
  }

  const email = await res.text();
  return { email };
};

// 회원가입 API
export async function signUpApi(form: SignupFormData) {
  const res = await fetch('https://hiteen.site/api/v1/members/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    throw new Error('회원가입 실패');
  }

  return res.json(); // 가입된 유저 정보 반환
}
