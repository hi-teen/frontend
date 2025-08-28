'use client';

import { tokenStorage, safeJsonParse, safeStorage } from '../utils/safeStorage';

export interface SchoolInfo {
  id: number;
  schoolName: string;
  schoolCode: string;
  eduOfficeCode: string;
  eduOfficeName: string;
  schoolUrl: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  schoolId: number;
  schoolName?: string;
  gradeNumber: number;
  classNumber: number;
}

export interface UserInfo {
  id?: number;
  email: string;
  name: string;
  gradeNumber: number;
  classNumber: number;
  school: SchoolInfo;
  schoolId?: number;
  schoolName?: string;
}

// 안전하게 JSON 파싱
async function safeParseResponse(res: Response) {
  let data;
  let text;
  try {
    data = await res.json();
  } catch {
    text = await res.text();
  }
  return { data, text };
}

// 이메일 중복 확인 API
export async function checkEmailAvailability(email: string): Promise<boolean> {
  const res = await fetch(`/api/v1/members/email/availability?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const { data, text } = await safeParseResponse(res);

  // 409 Conflict는 중복된 이메일을 의미
  if (res.status === 409) {
    return false; // 중복됨
  }

  if (!res.ok) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '이메일 중복 확인 실패';
    throw new Error(msg);
  }

  // success가 true면 사용 가능, false면 중복
  return data?.success || false;
}

// 회원가입 API
export async function signUpApi(form: SignupFormData): Promise<UserInfo> {
  const res = await fetch('/api/v1/members/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(form),
  });

  const { data, text } = await safeParseResponse(res);

  if (!res.ok) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '회원가입 실패';
    throw new Error(msg);
  }

  if (!data || !data.data) throw new Error('서버 응답이 JSON 형식이 아님');

  const profileData = JSON.stringify({
    email: data.data.email,
    name: data.data.name,
    gradeNumber: data.data.gradeNumber,
    classNumber: data.data.classNumber,
    school: data.data.school,
  });
  
  // 회원가입 임시 프로필은 전용 키에 보관 (인증 토큰과 분리)
  safeStorage.localStorage.setItem('signupProfile', profileData);

  return data.data;
}

// 로그인 API
export const loginApi = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const { data, text } = await safeParseResponse(res);

  if (!res.ok) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '로그인 실패';
    throw new Error(msg);
  }

  if (!data || !data.data || !data.data.accessToken) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '서버에서 올바른 토큰을 받지 못했습니다.';
    throw new Error(msg);
  }

  tokenStorage.setAccessToken(data.data.accessToken);
  tokenStorage.setRefreshToken(data.data.refreshToken);

  if (typeof window !== 'undefined') {
    document.cookie = `token=${data.data.accessToken}; path=/;`;
  }

  return { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
};


// 토큰 재발급 API (★로그아웃 및 안내 추가)
export const reissueToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    handleTokenExpired();
    throw new Error('리프레시 토큰 없음');
  }

  const res = await fetch('/api/v1/auth/reissue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const { data, text } = await safeParseResponse(res);

  if (!res.ok || !data?.data?.accessToken) {
    handleTokenExpired();
    throw new Error(
      (data && data.message) ||
      text ||
      '토큰 재발급 실패'
    );
  }

  tokenStorage.setAccessToken(data.data.accessToken);
  tokenStorage.setRefreshToken(data.data.refreshToken);

  if (typeof window !== 'undefined') {
    document.cookie = `token=${data.data.accessToken}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`;
  }

  return { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
};

// 토큰 만료/재발급 실패시 강제 로그아웃 함수
function handleTokenExpired() {
  tokenStorage.clearTokens();
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; Path=/; Max-Age=0; SameSite=Lax; Secure';
    alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
    window.location.href = '/login'; // 로그인 경로 맞게 수정
  }
}

// 내 정보 조회 (members/me)
export const fetchMe = async (): Promise<UserInfo> => {
  let token = tokenStorage.getAccessToken();
  if (!token) {
    handleTokenExpired();
    throw new Error('토큰 없음');
  }

  let res = await fetch('/api/v1/members/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (res.status === 401 || res.status === 403) {
    // 토큰 재발급 시도 → 실패시 handleTokenExpired가 처리
    const { accessToken } = await reissueToken();
    token = accessToken;
    res = await fetch('/api/v1/members/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  }

  const { data, text } = await safeParseResponse(res);

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      handleTokenExpired();
    }
    throw new Error(text || '유저 정보 가져오기 실패');
  }

  if (!data || !data.data) {
    handleTokenExpired();
    throw new Error('서버 응답이 JSON 형식이 아님');
  }

  return data.data;
};

// 인증 토큰 기반 fetch
export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let token = tokenStorage.getAccessToken();
  if (!token) {
    handleTokenExpired();
    throw new Error('토큰 없음');
  }

  let res = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (res.status === 401 || res.status === 403) {
    try {
      const { accessToken } = await reissueToken();
      token = accessToken;
      res = await fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (res.status === 401 || res.status === 403) {
        handleTokenExpired();
        throw new Error('세션 만료, 다시 로그인하세요');
      }
    } catch (e) {
      // reissueToken에서 이미 처리됨
      throw e;
    }
  }

  // Response를 복제해서 반환하여 body stream already read 오류 방지
  return res.clone();
}

export { safeParseResponse };
