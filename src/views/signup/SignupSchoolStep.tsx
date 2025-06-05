'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import SchoolConfirmModal from './SchoolConfirmModal';

export default function SignupSchoolStep() {
  const router = useRouter();
  const [school, setSchool] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchool(value);
    setShowDropdown(value.includes('한국고등학교'));
  };

  return (
    <div className="relative flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">학교를 입력해주세요</h1>

        <label className="text-sm text-[#2269FF] font-medium">학교</label>
        <div className="flex items-center border-b-2 mt-1 mb-3 border-gray-300 focus-within:border-[#2269FF]">
          <input
            type="text"
            value={school}
            onChange={handleInputChange}
            className="flex-grow outline-none py-2 text-base"
            placeholder="학교명을 입력하세요"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>

        {showDropdown && (
          <div
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 mt-2 cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          >
            <Image src="/school.png" alt="학교" width={24} height={24} />
            <div>
              <p className="text-xs text-gray-500">경기도 부천시</p>
              <p className="text-sm font-semibold">한국고등학교</p>
            </div>
          </div>
        )}
      </div>

      <SchoolConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => router.push('/signup/step/info')}
      />
    </div>
  );
}
