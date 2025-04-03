"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
} from "@heroicons/react/24/solid";

export default function PostDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      content: "나도 수학 진짜 어려워요ㅠㅠ 미적분 파트는 특히...",
      author: "익명",
      createdAt: "1시간 전",
    },
    {
      id: 2,
      content: "저는 수학 인강 듣고 있는데 도움 많이 돼요! 추천드려요~",
      author: "익명",
      createdAt: "30분 전",
    },
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: API 연동
  };

  const handleScrap = () => {
    setIsScrapped(!isScrapped);
    // TODO: API 연동
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        content: comment,
        author: "익명",
        createdAt: "방금 전",
      },
    ]);
    setComment("");
  };

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-4 mb-8'>
        <button
          onClick={() => router.back()}
          className='p-2 hover:bg-gray-100 rounded-full'
        >
          <ArrowLeftIcon className='w-6 h-6' />
        </button>
        <h1 className='text-2xl font-bold'>게시글</h1>
      </div>

      <article className='bg-white p-6 rounded-lg shadow-sm mb-8'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>
            오늘 수학 시험 망했어요ㅠㅠ
          </h2>
          <span className='text-sm text-gray-500'>2시간 전</span>
        </div>

        <div className='prose max-w-none mb-6'>
          <p className='text-gray-700'>
            진짜 수학 시험 개망했어요... 미적분 파트에서 완전 멘붕했거든요.
            선생님께서는 쉽게 내주셨다고 하시는데, 저는 진짜 어려웠어요.
            친구들은 다 잘 봤다고 하는데, 저만 이렇게 망했네요ㅠㅠ 다음 시험은
            꼭 잘 봐야겠어요. 수학 공부 어떻게 하시나요?
          </p>
        </div>

        <div className='flex items-center gap-4 text-sm text-gray-500'>
          <button
            onClick={handleLike}
            className='flex items-center gap-1 hover:text-red-500'
          >
            {isLiked ? (
              <HeartSolidIcon className='w-5 h-5 text-red-500' />
            ) : (
              <HeartIcon className='w-5 h-5' />
            )}
            <span>24</span>
          </button>
          <button
            onClick={handleScrap}
            className='flex items-center gap-1 hover:text-blue-500'
          >
            {isScrapped ? (
              <BookmarkSolidIcon className='w-5 h-5 text-blue-500' />
            ) : (
              <BookmarkIcon className='w-5 h-5' />
            )}
          </button>
          <div className='flex items-center gap-1'>
            <ChatBubbleLeftIcon className='w-5 h-5' />
            <span>12</span>
          </div>
          <div className='flex items-center gap-1'>
            <span>👀 156</span>
          </div>
        </div>
      </article>

      <section className='bg-white p-6 rounded-lg shadow-sm'>
        <h3 className='text-xl font-bold mb-4'>댓글</h3>

        <form onSubmit={handleCommentSubmit} className='mb-6'>
          <div className='flex gap-2'>
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='댓글을 입력하세요'
              className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
            >
              작성
            </button>
          </div>
        </form>

        <div className='space-y-4'>
          {comments.map((comment) => (
            <div key={comment.id} className='border-b border-gray-200 pb-4'>
              <div className='flex justify-between items-start mb-2'>
                <span className='font-medium'>{comment.author}</span>
                <span className='text-sm text-gray-500'>
                  {comment.createdAt}
                </span>
              </div>
              <p className='text-gray-700'>{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
