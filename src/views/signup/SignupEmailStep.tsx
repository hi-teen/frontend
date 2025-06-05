'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupEmailStep() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] max-w-lg mx-auto px-6 pt-28 pb-10 bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">이메일을 입력해주세요</h1>
        <label className="text-sm text-[#2269FF] font-medium">이메일</label>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-[#2269FF] py-2 text-base"
        />
        {email && (
          <p className={`text-sm mt-1 ${isValid ? 'text-[#2269FF]' : 'text-red-500'}`}>
            {isValid ? '사용 가능한 이메일입니다.' : '유효하지 않은 이메일입니다.'}
          </p>
        )}
      </div>

      <button
        disabled={!isValid}
        onClick={() => router.push('/signup/step/password')}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-base ${
          isValid ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        다음
      </button>
    </div>
  );
}
