'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import PostCard from '../../../app/_component/PostCard';
import { BoardItem } from '@/shared/api/board';

export default function MyScrapsPage() {
  const router = useRouter();
  const [scraps, setScraps] = useState<BoardItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    fetch('https://hiteen.site/api/v1/scraps/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('스크랩한 글 조회 실패');
        return res.json();
      })
      .then((data) => setScraps(data))
      .catch((e) => {
        console.error(e);
        alert('스크랩한 글을 불러오는 데 실패했습니다.');
      });
  }, []);

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
        {scraps.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            board={'게시판'} // 서버 응답에 board 없으면 임시 처리
            content={post.content}
            likes={post.loveCount}
            comments={0} // 댓글 수 없으면 임시 0 처리
            views={0}     // 조회 수 없으면 임시 0 처리
            date={new Date(post.createdAt).toLocaleDateString('ko-KR')}
          />
        ))}
      </div>
    </div>
  );
}
