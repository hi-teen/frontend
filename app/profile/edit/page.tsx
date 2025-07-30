'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface MeData {
  email: string;
  name: string;
  nickname: string;          // 서버가 요구하므로 상태에 유지
  gradeNumber: number;
  classNumber: number;
  school: { schoolName: string };
}

const fetchMe = async (): Promise<MeData> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');
  const res = await fetch('/api/v1/members/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('내 정보 조회 실패');
  const { data } = await res.json();
  return data;
};

const updateProfile = async (body: {
  email: string;
  name: string;
  nickname: string;         // 항상 포함
  password: string;
  passwordConfirm: string;
  gradeNumber: number;
  classNumber: number;
}) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');
  const res = await fetch('/api/v1/members/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || '프로필 수정 실패');
  }
  const { data } = await res.json();
  return data;
};

function parseGradeClass(str: string): { gradeNumber: number; classNumber: number } {
  const m = str.match(/(\d+)\s*학년\s*(\d+)\s*반/);
  return m
    ? { gradeNumber: +m[1], classNumber: +m[2] }
    : { gradeNumber: 0, classNumber: 0 };
}

function makeGradeClassStr(g?: number, c?: number) {
  return g && c ? `${g}학년 ${c}반` : '';
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');    // 상태만 유지
  const [classInfo, setClassInfo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        setEmail(data.email);
        setName(data.name);
        setNickname(data.nickname ?? '');          // 불러와 저장
        setSchoolName(data.school.schoolName);
        setClassInfo(makeGradeClassStr(data.gradeNumber, data.classNumber));
      } catch {
        setError('내 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setError('');
    if (!email.trim())    return setError('이메일을 입력하세요.');
    if (!name.trim())     return setError('이름을 입력하세요.');
    if (!password.trim()) return setError('비밀번호를 입력해주세요.');
    if (!passwordConfirm.trim()) return setError('비밀번호 확인을 입력해주세요.');
    if (password !== passwordConfirm) return setError('비밀번호가 일치하지 않습니다.');

    const { gradeNumber, classNumber } = parseGradeClass(classInfo);

    try {
      await updateProfile({
        email: email.trim(),
        name: name.trim(),
        nickname: nickname.trim(),               // 빈 문자열이라도 포함
        password,
        passwordConfirm,
        gradeNumber,
        classNumber,
      });
      router.push('/profile');
    } catch (e: any) {
      setError(e.message || '저장 실패');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-6">프로필 수정</h1>

      {loading ? (
        <div className="text-center text-gray-400 pt-12">불러오는 중...</div>
      ) : (
        <form
          onSubmit={e => { e.preventDefault(); handleSave(); }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm"
            />
          </div>

          {/*
          닉네임 입력은 UI에서 제거했습니다.
          <input type="hidden" value={nickname} />
          */}

          <div>
            <label className="block text-sm font-medium mb-1">
              학교
            </label>
            <input
              value={schoolName}
              readOnly
              className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              학년/반
            </label>
            <input
              value={classInfo}
              onChange={e =>
                setClassInfo(e.target.value.replace(/[^0-9학년반 ]/g, ''))
              }
              placeholder="예: 2학년 3반"
              className="w-full border rounded-xl px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white ${
              loading ? 'bg-gray-300' : 'bg-[#2269FF]'
            }`}
          >
            저장
          </button>
        </form>
      )}
    </div>
  );
}
