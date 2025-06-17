'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PostDetailPage() {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 pb-[80px]">
      {/* 상단 바 */}
      <div className="sticky top-0 bg-white z-50 flex items-center gap-4 px-4 py-3 border-b">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-base font-semibold">자유게시판</h1>
      </div>

      {/* 게시글 내용 */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>익명</span>
          <span>•</span>
          <span>1시간 전</span>
        </div>
        <h2 className="text-lg font-bold mb-3">오늘 축제 재밌었어요!</h2>
        <p className="text-sm text-gray-800 leading-relaxed mb-4">
          다들 어떤 부스 다녀오셨나요? 저는 먹거리 부스가 제일 좋았던 것 같아요!
          다음 축제는 언제일지 벌써부터 기대되네요 😄
        </p>
        <div className="rounded-xl overflow-hidden mb-4">
          <Image src="/festival.jpg" alt="축제 이미지" width={500} height={300} className="w-full object-cover" />
        </div>
        <div className="text-xs text-gray-400">조회수 123 · 댓글 4</div>
      </div>

      {/* 댓글 */}
      <div className="px-4 pt-6 space-y-5">
        <div className="flex gap-2 items-start">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
            <Image src="/usericon.png" alt="user" width={16} height={16} />
          </div>
          <div>
            <p className="font-semibold mb-1 text-sm">익명</p>
            <div className="bg-white rounded-xl px-4 py-2 inline-block text-sm">
              저도 먹거리 부스 재밌었어요~
            </div>
            <div className="text-[10px] text-gray-400 mt-1">13:11</div>
          </div>
        </div>

        <div className="flex justify-end gap-2 items-end">
          <div className="text-right">
            <div className="bg-white rounded-xl px-4 py-2 inline-block text-sm">
              친구랑 사진도 찍었는데 분위기가 좋았어요 ㅎㅎ
            </div>
            <div className="text-[10px] text-gray-400 mt-1">13:15</div>
          </div>
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-[64px] left-0 right-0 max-w-lg mx-auto bg-white border-t px-4 py-3 flex gap-2 z-50">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button className="text-[#2269FF] font-semibold text-sm px-2">등록</button>
      </div>
    </div>
  );
}
