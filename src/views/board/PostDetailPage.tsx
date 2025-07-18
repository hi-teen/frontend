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

// 익명/Nickname+이모지(프로필)
function getProfileInfo(writer: string) {
  if (writer === '익명') {
    return { name: '익명', emoji: '👤' };
  }
  // 원하는 닉네임 이모지 매칭이 있다면 확장 가능
  return { name: writer, emoji: '🙂' };
}

// 날짜 포맷 함수
function formatDate(dateStr: string) {
  // 2025-07-17 03:43:43 또는 2025-07-17T03:43:43
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(' ', 'T'));
  return `${date.getFullYear().toString().slice(2)}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

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

  const profile = getProfileInfo(detail.writer);

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
        <div className="flex items-center gap-2 text-xs font-bold mb-3">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{detail.categoryLabel}</span>
        </div>
        {/* 작성자 정보 & 날짜 (카톡 스타일) */}
        <div className="flex items-center gap-3 mb-2">
          {/* 프로필 아이콘 */}
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl">{profile.emoji}</span>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] text-gray-800">{profile.name}</span>
            <span className="text-xs text-gray-400">{formatDate(detail.createdDate)}</span>
          </div>
        </div>
        {/* 제목/내용 */}
        <div className="mt-2">
          <h2 className="text-lg font-bold mb-2">{detail.title}</h2>
          <div className="text-sm text-gray-800 leading-relaxed mb-3">{detail.content}</div>
        </div>
        {/* 실선 */}
        <hr className="my-3 border-t border-gray-200" />
        {/* 아이콘들 우측정렬 */}
        <div className="flex justify-end items-center gap-5 text-gray-500 text-sm">
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
          <button className="flex items-center gap-1" onClick={handleSendMessage}>
            <PaperAirplaneIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {/* 실선 */}
        <hr className="my-3 border-t border-gray-200" />
      </div>

      {/* 댓글 */}
      <div className="px-4 pt-1">
        <CommentSection boardId={Number(id)} onCommentCountChange={setCommentCount} />
      </div>
    </div>
  );
}
