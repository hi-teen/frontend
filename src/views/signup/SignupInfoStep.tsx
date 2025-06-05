'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function SignupInfoStep() {
  const router = useRouter();

  const [grade, setGrade] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const school = '한국고등학교';
  const name = '홍길동';

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
          <label className="text-sm text-gray-700 mb-1 block">학교</label>
          <div className="relative">
            <input
              type="text"
              value={school}
              readOnly
              className="w-full border-b-2 border-gray-300 bg-gray-50 text-gray-500 py-2 pr-8 outline-none"
            />
            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">이름</label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-full border-b-2 border-gray-300 bg-gray-50 text-gray-500 py-2 outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => router.push('/signup/step/email')}
        className="w-full mt-8 bg-[#2269FF] text-white text-base font-semibold py-4 rounded-xl"
      >
        다음
      </button>
    </div>
  );
}
