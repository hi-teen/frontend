'use client';

import PostCard from '../../../app/_component/PostCard';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function MyScrapsPage() {
  const router = useRouter();

  // TODO: 실제 데이터로 교체
  const dummyScraps = [
    {
      id: 3,
      title: '스크랩한 게시글',
      board: '비밀게시판',
      content: '이 글이 마음에 들어서 스크랩했어요.',
      likes: 20,
      comments: 7,
      views: 300,
      date: '5일 전',
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold mx-auto">스크랩한 글</h2>
        <div className="w-5" />
      </div>

      <div className="space-y-4">
        {dummyScraps.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
