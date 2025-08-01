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
        let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';
        
        if (err instanceof Error) {
          // 이메일 중복 에러 처리
          if (err.message.includes('이미 존재하는 이메일') || 
              err.message.includes('중복') || 
              err.message.includes('duplicate') ||
              err.message.includes('already exists')) {
            errorMessage = '이미 사용 중인 이메일입니다. 다른 이메일로 회원가입해주세요.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };

    submit();
  }, [form, setUser, router]);

  const handleRetry = () => {
    // 이메일 중복 에러인 경우 이메일 입력 단계로 돌아가기
    if (error.includes('이미 사용 중인 이메일')) {
      router.push('/signup/step/email');
    } else {
      // 다른 에러인 경우 다시 시도
      setError('');
      setIsSubmitting(true);
      calledRef.current = false;
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto bg-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        {isSubmitting ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2269FF] mx-auto mb-4"></div>
            <h1 className="text-xl font-bold mb-2">회원가입 중...</h1>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold mb-4 text-red-500">회원가입 실패</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="w-full py-3 bg-[#2269FF] text-white rounded-xl font-semibold"
            >
              {error.includes('이미 사용 중인 이메일') ? '이메일 변경하기' : '다시 시도'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">🎉</div>
            <h1 className="text-xl font-bold mb-2">회원가입 완료!</h1>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">{nickname}</span>님, 환영합니다!
            </p>
            <p className="text-sm text-gray-500">메인 페이지로 이동 중...</p>
          </div>
        )}
      </div>
    </div>
  );
}