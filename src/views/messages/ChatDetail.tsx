'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  Bars3Icon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-[#f8f8f8] px-4 pt-4 pb-20 relative">
      {/* 상단 바 */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => router.push('/messages')}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 날짜 */}
      <div className="flex justify-center mb-2">
        <span className="text-xs text-white bg-gray-400 px-3 py-1 rounded-full">25.05.05</span>
      </div>

      {/* 게시글 정보 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 text-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">🙊 비밀게시판</span>
        </div>
        <p className="font-semibold">오늘 축제</p>
        <div className="mt-3 py-2 px-4 bg-gray-50 text-center text-sm text-gray-500 rounded-xl">
          게시물 바로가기
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="space-y-4 text-sm">
        <div className="flex gap-2 items-end">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="font-semibold mb-1">익명</p>
            <div className="bg-white rounded-xl px-4 py-2 inline-block">안녕하세요 😊</div>
            <div className="text-[10px] text-gray-400 mt-1">13:11</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 items-end">
          <div className="text-right">
            <div className="bg-white rounded-xl px-4 py-2 inline-block">안녕하세요 😊</div>
            <div className="text-[10px] text-gray-400 mt-1">13:15</div>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="font-semibold mb-1">익명</p>
            <div className="bg-white rounded-xl px-4 py-2 inline-block">
              혹시 오늘 빨간 모자 쓴 분이신가요?
            </div>
            <div className="text-[10px] text-gray-400 mt-1">13:19</div>
          </div>
        </div>
      </div>
    </div>
  );
}
