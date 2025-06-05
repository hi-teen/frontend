'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NameInput from '@/features/signup/NameInput';

export default function StepNameView() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (name.trim()) {
      router.push('/signup/step/school'); // 다음 단계로 이동
    }
  };

  return (
    <div className="h-screen px-6 pt-20 pb-6 flex flex-col justify-between bg-white">
      <div>
        <h1 className="text-xl font-bold mb-8">이름을 입력해주세요</h1>
        <NameInput value={name} onChange={setName} />
      </div>

      <button
        onClick={handleNext}
        disabled={!name.trim()}
        className={`w-full py-4 rounded-xl text-white font-semibold ${
          name.trim() ? 'bg-[#2563FF]' : 'bg-gray-300'
        }`}
      >
        다음
      </button>
    </div>
  );
}
