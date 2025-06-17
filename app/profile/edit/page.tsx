'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('홍길동');
  const [school, setSchool] = useState('한국고등학교');
  const [classInfo, setClassInfo] = useState('2학년 2반');

  const handleSave = () => {
    // 저장 로직 구현 예정
    console.log({ name, school, classInfo });
    router.push('/profile');
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-6">프로필 수정</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">학교</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">학년 / 반</label>
          <input
            type="text"
            value={classInfo}
            onChange={(e) => setClassInfo(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-8 w-full bg-[#2269FF] text-white font-semibold py-3 rounded-xl text-sm"
      >
        저장
      </button>
    </div>
  );
}
