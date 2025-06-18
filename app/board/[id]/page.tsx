'use client';

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PostDetailPage() {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const toggleLike = () => setLiked((prev) => !prev);
  const toggleScrap = () => setScrapped((prev) => !prev);

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
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <Image src="/usericon.png" alt="user" width={14} height={14} />
          </div>
          <span className="font-semibold text-sm text-black">익명</span>
          <span className="text-gray-400 text-xs">· 06/18 12:24</span>
        </div>
        <h2 className="text-lg font-bold mb-3">밥을 먹어도 배고플 수 있나...?</h2>
        <div className="text-sm text-gray-800 leading-relaxed mb-4">
          사람이 맞나요? 궁금해요 초코파이 붐업
        </div>

        {/* 기능 아이콘 */}
        <div className="flex items-center gap-5 text-gray-500 text-sm mb-4">
          <button className="flex items-center gap-1" onClick={toggleLike}>
            <HeartIcon className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-xs">50</span>
          </button>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-xs">2</span>
          </div>
          <button className="flex items-center gap-1" onClick={toggleScrap}>
            <BookmarkIcon className={`w-5 h-5 ${scrapped ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-xs">12</span>
          </button>
          <button className="flex items-center gap-1 ml-auto">
            <PaperAirplaneIcon className="w-5 h-5" />
            <span className="text-xs">DM</span>
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <div className="px-4 pt-4 space-y-6">
        {[{ id: '1', name: '익명1', time: '06/18 12:26', content: '이거 상대평가라 점수보다 등수가 중요할걸?' },
          { id: '2', name: '익명(글쓴이)', time: '06/18 12:27', content: '그렇구나 고마워' }].map(comment => (
          <div key={comment.id}>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <Image src="/usericon.png" alt="user" width={14} height={14} />
              </div>
              <span className={`font-semibold text-sm ${comment.name.includes('글쓴이') ? 'text-green-600' : 'text-black'}`}>{comment.name}</span>
              <span className="text-gray-400 text-xs">· {comment.time}</span>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setReplyingTo(comment.id)}>
                  <ArrowUturnRightIcon className="w-4 h-4 text-gray-400" />
                </button>
                <button>
                  <PaperAirplaneIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-800 ml-8">{comment.content}</p>
            {replyingTo === comment.id && (
              <div className="ml-8 mt-2">
                <input
                  type="text"
                  placeholder="대댓글을 입력하세요"
                  className="w-full border rounded-full px-4 py-2 text-sm outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-[85px] left-0 right-0 max-w-lg mx-auto bg-white border-t px-4 py-3 flex gap-2 z-50">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />
        <button className="text-blue-500 font-semibold text-sm px-2">익명</button>
      </div>
    </div>
  );
}
