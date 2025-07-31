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
  const calledRef = useRef(false);

  useEffect(() => {
    const submit = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        // 1. 회원가입
        await signUpApi(form);

        // 2. 로그인 → accessToken, refreshToken 저장 + 쿠키 저장
        const tokens = await loginApi(form.email, form.password);

        // 3. 유저 정보 받아오기 (토큰 만료 시 자동 재발급)
        const userInfo = await fetchMe();
        setUser({
          id: userInfo.id || 0,
          email: userInfo.email,
          name: userInfo.name,
          schoolId: userInfo.schoolId || 0,
          gradeNumber: userInfo.gradeNumber,
          classNumber: userInfo.classNumber,
        });
        setNickname(userInfo.name);

        // 4. 메인 페이지로 이동
        router.replace('/');
      } catch (err) {
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
  }, [form, setUser, router]);

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto">
      <div>
        {isSubmitting ? (
          <p className="text-xl font-medium">회원가입 처리 중입니다...</p>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-red-500 text-base">{error}</p>
            <button
              onClick={() => router.push('/signup')}
              className="w-full bg-gray-500 text-white text-base font-semibold py-4 rounded-xl"
            >
              다시 시도하기
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold leading-relaxed whitespace-pre-line">
            {form.name}님, 환영합니다.
            {"\n"}하이틴 가입을 축하드려요!
          </p>
        )}
      </div>
    </div>
  );
}