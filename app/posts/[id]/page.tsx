'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  BookmarkIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import {
  fetchBoardDetail,
  toggleLove,
  toggleScrap as toggleScrapApi,
} from '@/shared/api/board';
import CommentSection from '@/features/comment/CommentSection';

interface BoardDetail {
  id: number;
  title: string;
  content: string;
  loveCount: number;
  scrapCount: number;
  createdDate: string;
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // /board/1 → id = '1'

  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [liked, setLiked] = useState(false);
  const [scrapped, setScrapped] = useState(false);
  const [commentCount, setCommentCount] = useState(0); // ✅ 댓글 수 상태 추가

  useEffect(() => {
    if (!id) return;
    fetchBoardDetail(Number(id))
      .then(setDetail)
      .catch((e) => {
        console.error('상세 조회 실패', e);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [id]);

  const handleToggleLike = async () => {
    try {
      await toggleLove(Number(id));
      setLiked((prev) => !prev);
      setDetail((prev) =>
        prev ? { ...prev, loveCount: prev.loveCount + (liked ? -1 : 1) } : prev
      );
    } catch (e) {
      console.error('좋아요 실패', e);
    }
  };

  const handleToggleScrap = async () => {
    try {
      await toggleScrapApi(Number(id));
      setScrapped((prev) => !prev);
      setDetail((prev) =>
        prev ? { ...prev, scrapCount: prev.scrapCount + (scrapped ? -1 : 1) } : prev
      );
    } catch (e) {
      console.error('스크랩 실패', e);
    }
  };

  if (!detail) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 pb-[80px]">
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
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <Image src="/profile.png" alt="user" width={14} height={14} />
          </div>
          <span className="font-semibold text-sm text-black">익명</span>
          <span className="text-gray-400 text-xs">· {detail.createdDate}</span>
        </div>
        <h2 className="text-lg font-bold mb-3">{detail.title}</h2>
        <div className="text-sm text-gray-800 leading-relaxed mb-4">
          {detail.content}
        </div>

        {/* 기능 아이콘 */}
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
        </div>
      </div>

      <div className="px-4 pt-4">
        <CommentSection boardId={Number(id)} onCommentCountChange={setCommentCount} />
      </div>
    </div>
  );
}
