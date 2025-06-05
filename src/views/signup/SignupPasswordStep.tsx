'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function SignupPasswordStep() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const email = 'reframe@gmail.com'; // 추후 context 또는 상태로 전달받도록 교체 예정
  const isValid = /^[A-Za-z\d]{7,}$/.test(password);

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] max-w-lg mx-auto px-6 pt-28 pb-10 bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">비밀번호를 입력해주세요</h1>

        <label className="text-sm text-[#2269FF] font-medium">비밀번호</label>
        <div className="relative border-b-2 border-gray-300 focus-within:border-[#2269FF] mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none py-2 text-base pr-10"
            placeholder="비밀번호 입력"
          />
          <button
            type="button"
            className="absolute right-0 top-1.5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">영어, 숫자 포함하여 7자리 이상 입력해주세요.</p>

        <label className="text-sm text-gray-400 font-medium">이메일</label>
        <input
          type="text"
          value={email}
          readOnly
          className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-gray-400 cursor-not-allowed"
        />
      </div>

      <button
        disabled={!isValid}
        onClick={() => router.push('/signup/step/complete')}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-base ${
          isValid ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        확인
      </button>
    </div>
  );
}
