'use client';

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

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  nickname: string;
  school: string;
  gradeNumber: number;
  classNumber: number;
}

// 로그인 API
export const loginApi = async (email: string, password: string): Promise<string> => {
  const res = await fetch('https://hiteen.site/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || '로그인 실패');
  }

  localStorage.setItem('accessToken', text);
  return text;
};

// 로그인된 사용자 정보 가져오기 
export const fetchMe = async (): Promise<UserInfo> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get('Content-Type');

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || '유저 정보 가져오기 실패');
  }

  const emailText = await res.text();
  const match = emailText.match(/사용자:\s*(.+)$/);
  const email = match ? match[1] : '';

  const saved = localStorage.getItem('signupProfile');
  const backup = saved ? JSON.parse(saved) : {};

  return {
    id: 0,
    email,
    name: backup.name ?? '',
    nickname: backup.nickname ?? '',
    school: backup.school ?? '',
    gradeNumber: backup.gradeNumber ?? 0,
    classNumber: backup.classNumber ?? 0,
  };
};

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
      name: form.name,
      nickname: form.nickname,
      school: form.school,
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
