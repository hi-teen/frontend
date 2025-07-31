'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { signupFormAtom } from '@/shared/stores/signup';
import SchoolConfirmModal from './SchoolConfirmModal';

interface School {
  id: number;
  schoolName: string;
}

export default function SignupSchoolStep() {
  const router = useRouter();
  const [form, setForm] = useAtom(signupFormAtom);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<School[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 검색어 입력시
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/schools/search?keyword=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error('학교 검색 실패');
      const schools = await res.json();
      setResults(schools);
      setShowDropdown(schools.length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // 학교 클릭 시
  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  // 확인 클릭 시 schoolId 저장
  const handleConfirm = () => {
    if (!selectedSchool) return;
    setForm((prev) => ({
      ...prev,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.schoolName,
      
    }));
    setShowModal(false);
    router.push('/signup/step/info');
  };

  return (
    <div className="relative flex flex-col justify-between min-h-[100dvh] px-6 pt-28 pb-10 max-w-lg mx-auto bg-white">
      <div>
        <h1 className="text-xl font-bold mb-6">학교를 입력해주세요</h1>

        <label className="text-sm text-[#2269FF] font-medium">학교</label>
        <div className="flex items-center border-b-2 mt-1 mb-3 border-gray-300 focus-within:border-[#2269FF]">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="flex-grow outline-none py-2 text-base"
            placeholder="학교명을 입력하세요"
            autoComplete="off"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* 검색 결과 드롭다운 */}
        {showDropdown && (
          <div className="mt-2 bg-white border rounded-lg shadow max-h-56 overflow-auto z-20 absolute left-0 right-0">
            {results.map((school) => (
              <div
                key={school.id}
                onClick={() => handleSchoolClick(school)}
                className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                <Image src="/school.png" alt="학교" width={24} height={24} />
                <p className="text-sm font-semibold">{school.schoolName}</p>
              </div>
            ))}
          </div>
        )}

        {loading && <div className="text-xs text-gray-400 mt-2">검색 중...</div>}
        {!loading && query.length > 1 && results.length === 0 && (
          <div className="text-xs text-gray-400 mt-2">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* 학교 선택 후 확인 모달 */}
      <SchoolConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        schoolName={selectedSchool?.schoolName}
      />
    </div>
  );
}
