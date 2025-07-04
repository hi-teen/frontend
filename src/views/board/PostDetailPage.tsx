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
import Image from 'next/image';
import {
  fetchBoardDetail,
  toggleLove,
  toggleScrap as toggleScrapApi,
  BoardItem,
} from '@/shared/api/board';
import CommentSection from '@/features/comment/CommentSection';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [detail, setDetail] = useState<BoardItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchBoardDetail(Number(id))
      .then((data) => setDetail(data))
      .catch((e) => {
        console.error('❌ 게시글 상세 조회 실패', e);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [id]);

  const handleToggleLike = async () => {
    if (!detail) return;
    try {
      await toggleLove(detail.id);
      setLiked((prev) => !prev);
      setDetail((prev) =>
        prev
          ? { ...prev, loveCount: prev.loveCount + (liked ? -1 : 1) }
          : prev
      );
    } catch (e) {
      console.error('❌ 좋아요 실패', e);
    }
  };

  const handleToggleScrap = async () => {
    if (!detail) return;
    try {
      await toggleScrapApi(detail.id);
      setScrapped((prev) => !prev);
      setDetail((prev) =>
        prev
          ? { ...prev, scrapCount: prev.scrapCount + (scrapped ? -1 : 1) }
          : prev
      );
    } catch (e) {
      console.error('❌ 스크랩 실패', e);
    }
  };

  const handleSendMessage = () => {
    if (!detail?.writer) {
      alert('쪽지를 보낼 수 없습니다.');
      return;
    }
    router.push(
      `/messages/chat?receiverId=${detail.writer}&boardId=${detail.id}`
    );
  };

  if (!detail) return <div>로딩 중...</div>;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-[80px]">
      {/* 상단 바 */}
      <div className="sticky top-0 bg-white z-50 flex items-center gap-4 px-4 py-3 border-b">
        <button onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-base font-semibold">게시글 상세</h1>
      </div>

      {/* 게시글 내용 */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">
            {detail.categoryLabel}
          </span>
          <span className="text-gray-400 text-xs">· {detail.createdDate}</span>
        </div>
        <h2 className="text-lg font-bold mb-3">{detail.title}</h2>
        <div className="text-sm text-gray-800 leading-relaxed mb-4">{detail.content}</div>
        <div className="flex items-center gap-5 text-gray-500 text-sm mb-4">
          <button className="flex items-center gap-1" onClick={handleToggleLike}>
            <HeartIcon className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.loveCount}</span>
          </button>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-xs">{commentCount}</span>
          </div>
          <button className="flex items-center gap-1" onClick={handleToggleScrap}>
            <BookmarkIcon className={`w-5 h-5 ${scrapped ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.scrapCount}</span>
          </button>
          {/* 쪽지 아이콘 */}
          <button className="flex items-center gap-1" onClick={handleSendMessage}>
            <PaperAirplaneIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
      {/* 댓글 */}
      <div className="px-4 pt-4">
        <CommentSection boardId={Number(id)} onCommentCountChange={setCommentCount} />
      </div>
    </div>
  );
}
