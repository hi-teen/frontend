'use client';

import PostCard from '../../../app/_component/PostCard';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function MyCommentsPage() {
  const router = useRouter();

  // TODO: 실제 데이터로 교체
  const dummyComments = [
    {
      id: 2,
      title: '댓글 단 글 제목',
      board: '정보게시판',
      content: '여기에 댓글을 남겼어요.',
      likes: 5,
      comments: 2,
      views: 40,
      date: '3일 전',
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold mx-auto">나의 댓글</h2>
        <div className="w-5" />
      </div>

      <div className="space-y-4">
        {dummyComments.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
