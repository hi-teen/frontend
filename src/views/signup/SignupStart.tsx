'use client';

import { useRouter } from 'next/navigation';

export default function SignupStartPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto">
      <div>
        <p className="text-2xl font-bold leading-relaxed whitespace-pre-line">
          하이틴을 사용하려면
          {"\n"}회원가입을 먼저 해주세요
        </p>
      </div>

      <button
        onClick={() => router.push('/signup/step/name')}
        className="w-full bg-custom-blue text-white text-base font-semibold py-4 rounded-xl"
      >
        회원가입 하기
      </button>
    </div>
  );
}
