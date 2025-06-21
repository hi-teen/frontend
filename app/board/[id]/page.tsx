'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import { fetchBoardDetail } from '@/shared/api/board';

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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBoardDetail(Number(id))
      .then(setDetail)
      .catch((e) => {
        console.error('상세 조회 실패', e);
        alert('게시글을 불러오는 데 실패했습니다.');
      });
  }, [id]);

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
            <Image src="/usericon.png" alt="user" width={14} height={14} />
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
          <button className="flex items-center gap-1" onClick={() => setLiked(!liked)}>
            <HeartIcon className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.loveCount}</span>
          </button>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-xs">0</span>
          </div>
          <button className="flex items-center gap-1" onClick={() => setScrapped(!scrapped)}>
            <BookmarkIcon className={`w-5 h-5 ${scrapped ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-xs">{detail.scrapCount}</span>
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
