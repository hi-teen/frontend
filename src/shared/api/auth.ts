'use client';

export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  schoolId: number;
  schoolName?: string;
  gradeNumber: number;
  classNumber: number;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  nickname: string;
  schoolId: number;
  gradeNumber: number;
  classNumber: number;
}

// 회원가입 API
export async function signUpApi(form: SignupFormData): Promise<UserInfo> {
  const res = await fetch('https://hiteen.site/api/v1/members/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const text = await res.text();

  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = json?.header?.message || '회원가입 실패';
      console.error('회원가입 실패 응답:', msg);
      throw new Error(msg);
    } catch {
      console.error('회원가입 실패 응답:', text);
      throw new Error(text || '회원가입 실패');
    }
  }

  // 회원가입 정보 저장
  localStorage.setItem(
    'signupProfile',
    JSON.stringify({
      email: form.email,
      name: form.name,
      nickname: form.nickname,
      schoolId: form.schoolId,
      schoolName: form.schoolName,
      gradeNumber: form.gradeNumber,
      classNumber: form.classNumber,
    })
  );

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('서버 응답이 JSON 형식이 아님');
  }
}

// 로그인 API (모든 상황에서 안전하게 처리)
export const loginApi = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const res = await fetch('https://hiteen.site/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();
  let data: any = null;
  let errorText: string | null = null;

  try {
    data = JSON.parse(text);
  } catch {
    errorText = text;
  }

  if (!res.ok) {
    // API가 header.message로 에러 메시지 내리는 구조라면
    const msg =
      (data && (data.header?.message || data.message)) ||
      errorText ||
      '로그인 실패';
    throw new Error(msg);
  }

  // 정상 응답이 JSON이 아닐 때 방어
  if (!data || !data.accessToken) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      errorText ||
      '서버에서 올바른 토큰을 받지 못했습니다.';
    throw new Error(msg);
  }

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
};


// 토큰 재발급 API (refreshToken → accessToken)
export const reissueToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('리프레시 토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/auth/reissue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const text = await res.text();
  let data: any = null;
  let errorText: string | null = null;

  try {
    data = JSON.parse(text);
  } catch {
    errorText = text;
  }

  if (!res.ok) {
    throw new Error(
      (data && data.message) ||
      errorText ||
      '토큰 재발급 실패'
    );
  }

  if (!data || !data.accessToken) {
    throw new Error('토큰 재발급에 실패했습니다.');
  }

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
};

// 로그인된 사용자 정보 가져오기 (자동 토큰 재발급 지원)
export const fetchMe = async (): Promise<UserInfo> => {
  let token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  let res = await fetch('https://hiteen.site/api/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    const { accessToken } = await reissueToken();
    token = accessToken;
    res = await fetch('https://hiteen.site/api/v1/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || '유저 정보 가져오기 실패');
  }

  const data = await res.json();
  return {
    id: data.id ?? 0,
    email: data.email ?? '',
    name: data.name ?? '',
    nickname: data.nickname ?? '',
    schoolId: data.schoolId ?? 0,
    gradeNumber: data.gradeNumber ?? 0,
    classNumber: data.classNumber ?? 0,
  };
};
