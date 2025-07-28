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
  nickname?: string;
  gradeNumber: number;
  classNumber: number;
  school: SchoolInfo;
  schoolId?: number;
  schoolName?: string;
}

// 안전하게 JSON 파싱
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

  if (!data || !data.data) throw new Error('서버 응답이 JSON 형식이 아님');

  localStorage.setItem(
    'signupProfile',
    JSON.stringify({
      email: data.data.email,
      name: data.data.name,
      nickname: data.data.nickname ?? '',
      gradeNumber: data.data.gradeNumber,
      classNumber: data.data.classNumber,
      school: data.data.school,
    })
  );

  return data.data;
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

  if (!data || !data.data || !data.data.accessToken) {
    const msg =
      (data && (data.header?.message || data.message)) ||
      text ||
      '서버에서 올바른 토큰을 받지 못했습니다.';
    throw new Error(msg);
  }

  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);

  return { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
};

// 토큰 재발급 API (★로그아웃 및 안내 추가)
export const reissueToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    handleTokenExpired();
    throw new Error('리프레시 토큰 없음');
  }

  const res = await fetch('https://hiteen.site/api/v1/auth/reissue', {
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

  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);

  return { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
};

// 토큰 만료/재발급 실패시 강제 로그아웃 함수
function handleTokenExpired() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
  window.location.href = '/login'; // 로그인 경로 맞게 수정
}

// 내 정보 조회 (members/me)
export const fetchMe = async (): Promise<UserInfo> => {
  let token = localStorage.getItem('accessToken');
  if (!token) {
    handleTokenExpired();
    throw new Error('토큰 없음');
  }

  let res = await fetch('https://hiteen.site/api/v1/members/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (res.status === 401 || res.status === 403) {
    // 토큰 재발급 시도 → 실패시 handleTokenExpired가 처리
    const { accessToken } = await reissueToken();
    token = accessToken;
    res = await fetch('https://hiteen.site/api/v1/members/me', {
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
  let token = localStorage.getItem('accessToken');
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

  return res;
}

export { safeParseResponse };
