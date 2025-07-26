'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const fetchMe = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');
  const res = await fetch('https://hiteen.site/api/v1/members/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('내 정보 조회 실패');
  const json = await res.json();
  return json.data;
};

const updateProfile = async (body: any) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');
  const res = await fetch('https://hiteen.site/api/v1/members/me', {
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
  const json = await res.json();
  return json.data;
};

// 학년/반을 "2학년 3반"에서 분리
function parseGradeClass(str: string): { gradeNumber: number; classNumber: number } {
  const match = str.match(/(\d+)\s*학년\s*(\d+)\s*반/);
  if (match) {
    return { gradeNumber: Number(match[1]), classNumber: Number(match[2]) };
  }
  // fallback
  return { gradeNumber: 0, classNumber: 0 };
}
function makeGradeClassStr(grade?: number, classNum?: number) {
  if (!grade && !classNum) return '';
  return `${grade ?? ''}학년 ${classNum ?? ''}반`;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [school, setSchool] = useState('');
  const [classInfo, setClassInfo] = useState('');

  const [error, setError] = useState('');

  // 기존 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMe();
        setName(data.name || '');
        setNickname(data.nickname || '');
        setSchool(data.school?.schoolName || '');
        setClassInfo(makeGradeClassStr(data.gradeNumber, data.classNumber));
      } catch (e: any) {
        setError('내 정보를 불러올 수 없습니다.');
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setError('');
    if (!name.trim()) {
      setError('이름을 입력하세요.');
      return;
    }
    if (!school.trim()) {
      setError('학교명을 입력하세요.');
      return;
    }
    const { gradeNumber, classNumber } = parseGradeClass(classInfo);

    try {
      await updateProfile({
        name,
        nickname,
        gradeNumber,
        classNumber,
      });
      router.push('/profile');
    } catch (e: any) {
      setError(
        e.message?.includes('409') ? '이미 사용중인 닉네임입니다.' : e.message || '저장 실패'
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-6">프로필 수정</h1>

      {loading ? (
        <div className="text-center text-gray-400 pt-12">불러오는 중...</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              maxLength={15}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              maxLength={15}
              placeholder="선택 (중복 불가)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학교 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학년 / 반</label>
            <input
              type="text"
              value={classInfo}
              onChange={(e) => setClassInfo(e.target.value.replace(/[^0-9학년반 ]/g, ''))}
              placeholder="예: 2학년 3반"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              maxLength={12}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <button
            type="submit"
            className="mt-8 w-full bg-[#2269FF] text-white font-semibold py-3 rounded-xl text-sm"
            disabled={loading}
          >
            저장
          </button>
        </form>
      )}
    </div>
  );
}
