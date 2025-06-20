'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';
import { signUpApi } from '@/shared/api/auth';

export default function SignupCompletePage() {
  const router = useRouter();
  const [form] = useAtom(signupFormAtom);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const submit = async () => {
      try {
        const result = await signUpApi(form);
        setNickname(result.nickname); // 응답 객체에 nickname 있음
      } catch (err) {
        console.error(err);
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  }, [form]);

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto">
      <div>
        {isSubmitting ? (
          <p className="text-xl font-medium">회원가입 처리 중입니다...</p>
        ) : error ? (
          <p className="text-red-500 text-base">{error}</p>
        ) : (
          <p className="text-2xl font-bold leading-relaxed whitespace-pre-line">
            {form.name}님, 환영합니다.
            {"\n"}하이틴 가입을 축하드려요!
          </p>
        )}
      </div>

      {!isSubmitting && !error && (
        <button
          onClick={() => router.push('/')}
          className="w-full bg-custom-blue text-white text-base font-semibold py-4 rounded-xl"
        >
          시작하기
        </button>
      )}
    </div>
  );
}
