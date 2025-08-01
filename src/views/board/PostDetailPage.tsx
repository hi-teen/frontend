'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import {
  fetchBoardDetail,
  toggleLove,
  toggleScrap as toggleScrapApi,
  BoardItem,
} from '@/shared/api/board';
import CommentSection from '@/features/comment/CommentSection';
import { sendAnonymousMessage } from '@/shared/api/message';

const emojis = [
  '🐶','🐱','🐰','🐻','🐼','🦊','🐯','🦁',
  '🐵','🦄','🐸','🐷','🐥','🦖','🦉','🦦'
];

function getProfileName(writer: string) {
  return writer === '익명' ? '익명' : writer;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(' ', 'T'));
  return `${date.getFullYear().toString().slice(2)}/${(date.getMonth()+1)
    .toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')} ${date
    .getHours().toString().padStart(2,'0')}:${date
    .getMinutes().toString().padStart(2,'0')}`;
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [detail, setDetail] = useState<BoardItem|null>(null);
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchBoardDetail(+id)
      .then(setDetail)
      .catch(() => alert('게시글 불러오기 실패'));
  }, [id]);

  const handleSendMessage = async () => {
    if (!detail) return;
    try {
      // 채팅방 생성하지 않고 ChatDetail 페이지로 이동
      router.push(`/messages/new?boardId=${detail.id}&isBoardWriter=true`);
    } catch {
      alert('채팅방 생성 실패');
    }
  };

  if (!detail) return <div className="p-4 text-center">로딩 중…</div>;

  const name = getProfileName(detail.writer);
  const emoji = emojis[0];

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-[80px]">
      {/* 상단바 */}
      <div className="sticky top-0 bg-white z-50 flex items-center gap-4 px-4 py-3 border-b">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-base font-semibold">게시글 상세</h1>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 text-xs font-bold mb-3">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
            {detail.categoryLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl">
            {emoji}
          </span>
          <div>
            <div className="font-bold text-[15px] text-gray-800">{name}</div>
            <div className="text-xs text-gray-400">
              {formatDate(detail.createdAt)}
            </div>
          </div>
        </div>

        <h2 className="m-2 mt-4 text-lg font-bold mb-2">{detail.title}</h2>
        <div className="m-2 text-sm text-gray-800 leading-relaxed mb-3">
          {detail.content}
        </div>

        <hr className="mt-6 mb-2 border-t border-gray-200" />

        <div className="mb-2 flex justify-end items-center gap-5 text-gray-500 text-sm">
          <button className="flex items-center gap-1" onClick={() => {
            toggleLove(detail.id).then(() => setLiked(!liked));
            setDetail(prev => prev && ({ ...prev, loveCount: prev.loveCount + (liked ? -1 : 1) }));
          }}>
            <HeartIcon className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.loveCount}</span>
          </button>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-xs">{commentCount}</span>
          </div>
          <button className="flex items-center gap-1" onClick={() => {
            toggleScrapApi(detail.id).then(() => setScrapped(!scrapped));
            setDetail(prev => prev && ({ ...prev, scrapCount: prev.scrapCount + (scrapped ? -1 : 1) }));
          }}>
            <BookmarkIcon className={`w-5 h-5 ${scrapped ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.scrapCount}</span>
          </button>
          <button className="flex items-center gap-1" onClick={handleSendMessage}>
            <PaperAirplaneIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <CommentSection
        boardId={+id!}
        onCommentCountChange={setCommentCount}
      />
    </div>
  );
}
