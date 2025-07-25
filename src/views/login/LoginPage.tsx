'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useSetAtom } from 'jotai';
import { loginApi, fetchMe } from '@/shared/api/auth';
import { userAtom } from '@/entities/auth/model';
import { accessTokenAtom } from '@/shared/stores/auth';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const setAccessToken = useSetAtom(accessTokenAtom);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 7;
  const canLogin = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    setError('');
    try {
      // 로그인 후 accessToken, refreshToken 반환받기
      const { accessToken, refreshToken } = await loginApi(email, password);

      setAccessToken(accessToken); // Jotai에도 문자열만
      // localStorage에는 loginApi가 이미 저장함

      // 사용자 정보 불러오기
      // const me = await fetchMe();
      // setUser(me);

      // 홈으로 이동
      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '이메일 또는 비밀번호를 다시 확인해주세요.');
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] max-w-lg mx-auto px-6 pt-28 pb-10 bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">로그인</h1>

        {/* 이메일 입력 */}
        <label className="text-sm text-[#2269FF] font-medium">이메일</label>
        <div className="border-b-2 border-gray-300 focus-within:border-[#2269FF] mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none py-2 text-base"
            placeholder="이메일 입력"
          />
        </div>

        {/* 비밀번호 입력 */}
        <label className="text-sm text-[#2269FF] font-medium">비밀번호</label>
        <div className="relative border-b-2 border-gray-300 focus-within:border-[#2269FF] mb-1">
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
        <p className="text-sm text-gray-500 mb-4">비밀번호는 7자 이상 입력해주세요.</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* 로그인 버튼 */}
      <button
        disabled={!canLogin}
        onClick={handleLogin}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-white text-base ${
          canLogin ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        로그인
      </button>
    </div>
  );
}
