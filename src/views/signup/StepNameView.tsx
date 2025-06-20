'use client';

import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';
import NameInput from '@/features/signup/NameInput';

export default function StepNameView() {
  const [form, setForm] = useAtom(signupFormAtom);
  const router = useRouter();

  const handleNext = () => {
    if (form.name.trim()) {
      router.push('/signup/step/school');
    }
  };

  return (
    <div className="h-screen px-6 pt-20 pb-6 flex flex-col justify-between bg-white">
      <div>
        <h1 className="text-xl font-bold mb-8">이름을 입력해주세요</h1>
        <NameInput
          value={form.name}
          onChange={(name) => setForm((prev) => ({ ...prev, name }))}
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!form.name.trim()}
        className={`w-full py-4 rounded-xl text-white font-semibold ${
          form.name.trim() ? 'bg-[#2269FF]' : 'bg-gray-300'
        }`}
      >
        다음
      </button>
    </div>
  );
}
