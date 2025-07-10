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

  // 회원가입 정보 저장 (school 포함)
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
