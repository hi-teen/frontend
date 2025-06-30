'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';
import { userAtom } from '@/entities/auth/model/authAtom';
import { signUpApi, loginApi, fetchMe } from '@/shared/api/auth';

export default function SignupCompletePage() {
  const router = useRouter();
  const [form] = useAtom(signupFormAtom);
  const [, setUser] = useAtom(userAtom);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');
  const calledRef = useRef(false); // 중복 호출 방지용

  useEffect(() => {
    const submit = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        // 회원가입
        await signUpApi(form);

        // 로그인
        await loginApi(form.email, form.password);

        // 사용자 정보 받아오기 (email + signupProfile 기반)
        const userInfo = await fetchMe();
        setUser(userInfo);
        setNickname(userInfo.nickname);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : '회원가입에 실패했습니다. 다시 시도해주세요.'
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  }, [form, setUser]);

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
