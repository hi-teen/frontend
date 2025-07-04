'use client';

import { useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import PostCard from '../../../app/_component/PostCard';
import { fetchMyLikes } from '@/shared/api/profile';
import { BoardItem } from '@/shared/api/board';

export default function MyLikesPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardItem[]>([]);

  useEffect(() => {
    fetchMyLikes()
      .then(setPosts)
      .catch((e) => {
        console.error('좋아요한 글 불러오기 실패', e);
        alert('좋아요한 글을 불러오는 데 실패했습니다.');
      });
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold mx-auto">좋아요한 글</h2>
        <div className="w-5" />
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-10">좋아요한 글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              board={post.categoryLabel ?? '자유게시판'}
              content={post.content}
              likes={post.loveCount}
              comments={0}
              views={0}
              date={post.createdDate}
            />
          ))
        )}
      </div>
    </div>
  );
}
