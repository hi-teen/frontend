'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';
import { checkEmailAvailability } from '@/shared/api/auth';

export default function SignupEmailStep() {
  const router = useRouter();
  const [form, setForm] = useAtom(signupFormAtom);

  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  // 초기 렌더링 시 전역 상태의 이메일 불러오기
  useEffect(() => {
    if (form.email) {
      setEmail(form.email);
      setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));
    }
  }, [form.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleNext = async () => {
    if (!isValid) return;
    
    try {
      const available = await checkEmailAvailability(email);
      
      if (!available) {
        alert('이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.');
        return;
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이메일 중복 확인에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    setForm((prev) => ({
      ...prev,
      email,
    }));

    router.push('/signup/step/password');
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
        onClick={handleNext}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-base ${
          isValid ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        다음
      </button>
    </div>
  );
}
