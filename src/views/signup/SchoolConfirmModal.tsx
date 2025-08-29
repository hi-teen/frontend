'use client';

import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  schoolName?: string;
  eduOfficeName?: string;
}

export default function SchoolConfirmModal({ isOpen, onClose, onConfirm, schoolName, eduOfficeName }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-8">
        <h2 className="text-lg font-bold mb-1">학교 정보를 확인해주세요</h2>
        <p className="text-sm text-red-500 mb-4">가입 이후에는 학교를 변경할 수 없어요</p>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/school.png" 
            alt="학교" 
            width={28} 
            height={28}
            className="flex-shrink-0"
            priority
          />
          <div>
            <p className="text-xs text-gray-500">
              {schoolName ? '' : '학교를 선택해주세요.'}
            </p>
            <p className="text-sm font-semibold">
              {schoolName ?? '학교명 없음'}
            </p>
            {eduOfficeName && (
              <p className="text-xs text-gray-500">({eduOfficeName})</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold"
          >
            수정할게요
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#2269FF] text-white font-semibold"
          >
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
}
