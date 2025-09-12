'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupAtom } from '@/entities/auth/model/signupAtom';
import { validateReferralCode } from '@/shared/api/auth';

export default function ReferralStepView() {
  const router = useRouter();
  const [form, setForm] = useAtom(signupAtom);
  const [referralCode, setReferralCode] = useState(form.referralCode || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  const handleValidateCode = async () => {
    if (!referralCode.trim()) {
      setValidationResult(null);
      setValidationMessage('');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setValidationMessage('');

    try {
      const isValid = await validateReferralCode(referralCode.trim());
      if (isValid) {
        setValidationResult('valid');
        setValidationMessage('유효한 추천코드입니다!');
      } else {
        setValidationResult('invalid');
        setValidationMessage('존재하지 않는 추천코드입니다.');
      }
    } catch (error) {
      setValidationResult('invalid');
      setValidationMessage('추천코드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    setForm(prev => ({
      ...prev,
      referralCode: referralCode.trim() || undefined,
    }));
    router.push('/signup/step/complete');
  };

  const handleSkip = () => {
    setForm(prev => ({
      ...prev,
      referralCode: undefined,
    }));
    router.push('/signup/step/complete');
  };

  return (
    <div className="flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto bg-white">
      <div className="flex-1">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold mb-2">추천코드 입력</h1>
          <p className="text-gray-600 text-sm">
            친구에게 받은 추천코드가 있다면<br />
            입력해주세요!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추천코드
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value);
                  setValidationResult(null);
                  setValidationMessage('');
                }}
                placeholder="추천코드를 입력하세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
              <button
                onClick={handleValidateCode}
                disabled={!referralCode.trim() || isValidating}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                {isValidating ? '확인중...' : '확인'}
              </button>
            </div>
            
            {validationMessage && (
              <p className={`mt-2 text-sm ${
                validationResult === 'valid' ? 'text-green-600' : 'text-red-600'
              }`}>
                {validationMessage}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 text-lg">💡</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">추천코드 혜택</p>
                <p> 친구 추천 이벤트 진행중입니다<br />추첨을 통해 특별한 선물이 제공되니 친구와 함께 가입해보세요 !</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-2">

      <button
          onClick={handleSkip}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          건너뛰기
        </button>

        <button
          onClick={handleNext}
          disabled={referralCode.trim() && validationResult !== 'valid'}
          className="w-full py-3 bg-[#2269FF] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          다음 단계
        </button>
        
      </div>
    </div>
  );
}
