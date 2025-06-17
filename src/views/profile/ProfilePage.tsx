'use client';

import { UserIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function ProfilePage() {
  return (
    <div className="px-4 pt-6 pb-20 max-w-lg mx-auto bg-gray-50 space-y-6">
      {/* 프로필 박스 */}
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold">홍길동</p>
            <p className="text-gray-500">한국고등학교</p>
            <p className="text-gray-400 text-xs">2학년 2반</p>
          </div>
        </div>
        <button className="text-sm text-blue-500 font-semibold">수정</button>
      </div>

      {/* 나의 글 */}
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
        <p className="font-semibold text-sm">나의 글</p>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
      </div>

      {/* 나의 댓글 */}
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
        <p className="font-semibold text-sm">나의 댓글</p>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
      </div>

      {/* 고객 지원 */}
      <div className="bg-white p-4 rounded-2xl text-sm shadow-sm">
        <p className="font-semibold mb-2">고객지원</p>
        <ul className="space-y-2 text-gray-600">
          <li className="hover:underline cursor-pointer">약관 및 정책</li>
          <li className="hover:underline cursor-pointer">커뮤니티 정책</li>
        </ul>
      </div>
    </div>
  );
}
