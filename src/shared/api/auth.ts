'use client';

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
  nickname: string;
  schoolId: number;
  schoolName?: string;
  gradeNumber: number;
  classNumber: number;
}

export interface UserInfo {
  id?: number;
  email: string;
  name: string;
  nickname: string;
  gradeNumber: number;
  classNumber: number;
  school: SchoolInfo;
  schoolId?: number;
  schoolName?: string; 
}

// fetch 응답 안전하게 파싱
async function safeParseResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  const text = await res.text();
  let data: any = null;
  if (contentType && contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  return { data, text };
}

// 회원가입 API
export async function signUpApi(form: SignupFormData): Promise<UserInfo> {
  const res = await fetch('https://hiteen.site/api/v1/members/sign-up', {
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

  if (!data) throw new Error('서버 응답이 JSON 형식이 아님');

  // 회원가입 정보 저장 (school 전체 포함)
  localStorage.setItem(
    'signupProfile',
    JSON.stringify({
      email: data.email,
      name: data.name,
      nickname: data.nickname,
      gradeNumber: data.gradeNumber,
      classNumber: data.classNumber,
      school: data.school,
    })
  );

  return data;
}

// 로그인 API
export const loginApi = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const res = await fetch('https://hiteen.site/api/v1/auth/login', {
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

  if (!data || !data.accessToken) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '서버에서 올바른 토큰을 받지 못했습니다.';
    throw new Error(msg);
  }

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
};

// 토큰 재발급 API
export const reissueToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('리프레시 토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/auth/reissue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const { data, text } = await safeParseResponse(res);

  if (!res.ok) {
    throw new Error(
      (data && data.message) ||
      text ||
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

  const { data, text } = await safeParseResponse(res);

  if (!res.ok) {
    throw new Error(text || '유저 정보 가져오기 실패');
  }

  if (!data) {
    throw new Error('서버 응답이 JSON 형식이 아님');
  }

  return {
    id: data.id ?? 0,
    email: data.email ?? '',
    name: data.name ?? '',
    nickname: data.nickname ?? '',
    gradeNumber: data.gradeNumber ?? 0,
    classNumber: data.classNumber ?? 0,
    school: data.school || {
      id: 0, schoolName: '', schoolCode: '', eduOfficeCode: '', eduOfficeName: '', schoolUrl: '',
    },
  };
};

export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  let res = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // 만료(401/403)시 refresh → access 재시도
  if (res.status === 401 || res.status === 403) {
    const { accessToken } = await reissueToken();
    token = accessToken;
    res = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return res;
}
