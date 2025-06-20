'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';

export default function SignupPasswordStep() {
  const router = useRouter();
  const [form, setForm] = useAtom(signupFormAtom);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (form.password) setPassword(form.password);
    if (form.passwordConfirm) setConfirm(form.passwordConfirm);
  }, [form]);

  const isValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/.test(password); // 영어+숫자 7자 이상
  const isMatched = password === confirm;
  const canProceed = isValid && isMatched;

  const handleNext = () => {
    if (!canProceed) return;

    setForm((prev) => ({
      ...prev,
      password,
      passwordConfirm: confirm,
    }));

    router.push('/signup/step/complete');
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] max-w-lg mx-auto px-6 pt-28 pb-10 bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">비밀번호를 입력해주세요</h1>

        {/* 비밀번호 */}
        <label className="text-sm text-[#2269FF] font-medium">비밀번호</label>
        <div className="relative border-b-2 border-gray-300 focus-within:border-[#2269FF] mb-4">
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

        {/* 비밀번호 확인 */}
        <label className="text-sm text-[#2269FF] font-medium">비밀번호 확인</label>
        <div className="relative border-b-2 border-gray-300 focus-within:border-[#2269FF] mb-1">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full outline-none py-2 text-base pr-10"
            placeholder="비밀번호 확인"
          />
          <button
            type="button"
            className="absolute right-0 top-1.5"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
        {!isMatched && confirm && (
          <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
        )}
      </div>

      <button
        disabled={!canProceed}
        onClick={handleNext}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-base ${
          canProceed ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        확인
      </button>
    </div>
  );
}
