'use client';

import { useRouter } from 'next/navigation';

export default function SignupCompletePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto">
      <div>
        <p className="text-2xl font-bold leading-relaxed whitespace-pre-line">
          홍길동님, 환영합니다.
          {"\n"}하이틴 가입을 축하드려요!
        </p>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full bg-custom-blue text-white text-base font-semibold py-4 rounded-xl"
      >
        시작하기
      </button>
    </div>
  );
}
