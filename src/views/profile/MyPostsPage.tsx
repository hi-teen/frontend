'use client';

import PostCard from '../../../app/_component/PostCard';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function MyPostsPage() {
  const router = useRouter();

  // TODO: 실제 데이터로 교체
  const dummyPosts = [
    {
      id: 1,
      title: '내가 쓴 글 제목',
      board: '자유게시판',
      content: '이건 내가 작성한 글이에요.',
      likes: 10,
      comments: 3,
      views: 120,
      date: '1일 전',
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold mx-auto">나의 글</h2>
        <div className="w-5" />
      </div>

      <div className="space-y-4">
        {dummyPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
