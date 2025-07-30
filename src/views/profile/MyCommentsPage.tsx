'use client';

import { useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { fetchMyComments } from '@/shared/api/profile';

interface MyCommentItem {
  commentId: number;
  content: string;
  boardId: number;
  boardTitle: string;
  createdAt: string;
}

export default function MyCommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<MyCommentItem[]>([]);

  useEffect(() => {
    fetchMyComments()
      .then(setComments)
      .catch((e) => {
        console.error('내 댓글 불러오기 실패', e);
        alert('댓글을 불러오는 데 실패했습니다.');
      });
  }, []);

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
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-10">작성한 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm"
            >
              <p className="text-xs text-gray-400 mb-1">
                {comment.createdAt} · <span className="text-blue-500">{comment.boardTitle}</span>
              </p>
              <p className="text-sm text-gray-800">{comment.content}</p>
              <div className="mt-2 text-right">
                <button
                  onClick={() => router.push(`/board/${comment.boardId}`)}
                  className="text-xs text-blue-500"
                >
                  원글 보기 →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
