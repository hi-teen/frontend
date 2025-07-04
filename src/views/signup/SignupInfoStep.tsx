'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';

export default function SignupInfoStep() {
  const router = useRouter();
  const [form, setForm] = useAtom(signupFormAtom);

  const [grade, setGrade] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [nickname, setNickname] = useState('');

  // 화면 처음 열릴 때 전역 상태에 저장된 값 보여주기 (수정 시 대비)
  useEffect(() => {
    setGrade(form.gradeNumber ? String(form.gradeNumber) : '');
    setClassNumber(form.classNumber ? String(form.classNumber) : '');
    setNickname(form.nickname || '');
  }, [form]);

  const handleNext = () => {
    if (!grade || !classNumber || !nickname.trim()) return;

    // 전역 상태에 학년/반/닉네임 업데이트
    setForm((prev) => ({
      ...prev,
      gradeNumber: parseInt(grade, 10),
      classNumber: parseInt(classNumber, 10),
      nickname: nickname.trim(),
    }));

    router.push('/signup/step/email');
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto bg-white">
      <div>
        <h1 className="text-xl font-bold mb-8">정보를 입력해주세요</h1>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm text-gray-700 mb-1 block">학년</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-[#2269FF] outline-none py-2 text-base"
              placeholder="학년"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-700 mb-1 block">반</label>
            <input
              type="text"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:border-[#2269FF] outline-none py-2 text-base"
              placeholder="반"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-1 block">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border-b-2 border-gray-300 focus:border-[#2269FF] outline-none py-2 text-base"
            placeholder="닉네임 입력"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-1 block">학교</label>
          <div className="relative">
            <input
              type="text"
              value={form.schoolName ?? ''}
              readOnly
              className="w-full border-b-2 border-gray-300 bg-gray-50 text-gray-500 py-2 pr-8 outline-none"
              placeholder="학교를 선택하세요"
            />
            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">이름</label>
          <input
            type="text"
            value={form.name}
            readOnly
            className="w-full border-b-2 border-gray-300 bg-gray-50 text-gray-500 py-2 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!grade || !classNumber || !nickname.trim()}
        className={`w-full mt-8 py-4 rounded-xl text-white text-base font-semibold ${
          grade && classNumber && nickname.trim() ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        다음
      </button>
    </div>
  );
}
