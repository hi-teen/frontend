'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import PostCard from '../../../app/_component/PostCard';
import { fetchMyPosts } from '@/shared/api/board';
import { BoardItem } from '@/shared/api/board';

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          console.log('[DEBUG] accessToken:', token);
          if (!token) {
            alert('토큰 없음(로그인 필요)');
            setLoading(false);
            return;
          }
          const data = await fetchMyPosts(); // 이미 내부에서 토큰 체크하니 사실 중복이긴 함
          console.log('[DEBUG] 내 글 데이터:', data);
          setPosts(data);
        } catch (err) {
          console.error('내 글 조회 실패:', err);
          alert('내 글을 불러오는 데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      };
    
      loadPosts();
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-semibold mx-auto">나의 글</h2>
        <div className="w-5" />
      </div>

      {loading ? (
        <p className="text-center text-sm text-gray-500">불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-gray-400">작성한 글이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              board={post.categoryLabel ?? '자유게시판'}
              content={post.content}
              likes={post.loveCount}
              comments={post.commentCount ?? 0}
              views={post.viewCount ?? 0}
              date={post.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
