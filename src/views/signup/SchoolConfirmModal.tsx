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
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path d="M16.4 6.04342L21.6056 3.83942C22.1968 3.58902 22.1968 2.75142 21.6056 2.50102L16.2864 0.249023C16.356 0.321023 16.4 0.418623 16.4 0.526623V6.04342Z" fill="#4592FB"/>
            <path d="M16.4 6.29287V0.526465C16.4 0.418465 16.356 0.320865 16.2864 0.248865C16.2136 0.173665 16.1128 0.126465 16 0.126465C15.7792 0.126465 15.6 0.305665 15.6 0.526465V6.29287C15.8528 6.15846 16.1472 6.15846 16.4 6.29287Z" fill="#333D4B"/>
            <path d="M20.5392 30.1655H27.0744C28.0272 30.1655 28.8 29.3927 28.8 28.4399V13.8335H20.5392V30.1655Z" fill="#D0D5DA"/>
            <path d="M3.19995 13.8328V28.4392C3.19995 29.392 3.97275 30.1648 4.92555 30.1648H11.4608V13.832L3.19995 13.8328Z" fill="#D0D5DA"/>
            <path d="M28.8 12.9678V13.8318H20.536L16 9.27185L11.464 13.8318H3.19995V12.9678C3.19995 12.0158 3.97595 11.2398 4.92795 11.2398H10.6L15.392 6.43185C15.448 6.36785 15.528 6.33585 15.6 6.29585C15.856 6.15985 16.144 6.15985 16.4 6.29585C16.472 6.33585 16.552 6.36785 16.608 6.43185L21.4 11.2398H27.072C28.024 11.2398 28.8 12.0158 28.8 12.9678Z" fill="#4592FB"/>
            <path d="M20.5392 13.8326L16 9.271L11.4608 13.8326V30.1654H20.5392V13.8326ZM18.1576 30.1654H13.8432V26.8158C13.8432 26.283 14.2752 25.851 14.808 25.851H17.1928C17.7256 25.851 18.1576 26.283 18.1576 26.8158V30.1654ZM16 19.7518C14.3656 19.7518 13.0408 18.427 13.0408 16.7934C13.0408 15.1598 14.3656 13.8342 16 13.8342C17.6344 13.8342 18.9592 15.159 18.9592 16.7934C18.9592 18.4278 17.6344 19.7518 16 19.7518Z" fill="#E5E9EE"/>
            <path d="M16 13.8335C14.3656 13.8335 13.0408 15.1583 13.0408 16.7927C13.0408 18.4271 14.3656 19.7511 16 19.7511C17.6344 19.7511 18.9592 18.4263 18.9592 16.7927C18.9592 15.1591 17.6344 13.8335 16 13.8335ZM16.4 17.1999H14.5808C14.36 17.1999 14.1808 17.0207 14.1808 16.7999C14.1808 16.5791 14.36 16.3999 14.5808 16.3999H15.6V14.9503C15.6 14.7295 15.7792 14.5503 16 14.5503C16.2208 14.5503 16.4 14.7295 16.4 14.9503V17.1999Z" fill="white"/>
            <path d="M17.1929 25.8501H14.8081C14.2753 25.8501 13.8433 26.2821 13.8433 26.8149V30.1645H18.1577V26.8149C18.1577 26.2821 17.7257 25.8501 17.1929 25.8501Z" fill="#6B7683"/>
            <path d="M16.0001 14.5503C15.7793 14.5503 15.6001 14.7295 15.6001 14.9503V16.3999H14.5809C14.3601 16.3999 14.1809 16.5791 14.1809 16.7999C14.1809 17.0207 14.3601 17.1999 14.5809 17.1999H16.4001V14.9503C16.4001 14.7295 16.2209 14.5503 16.0001 14.5503Z" fill="#6B7683"/>
          </svg>
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
