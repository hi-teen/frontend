'use client';

import Image from 'next/image';
import type { HotPost } from '@/entities/post/types';

interface Props {
  posts: HotPost[];
}

export default function PostList({ posts }: Props) {
  return (
    <div className="px-4 mt-4 space-y-4">
      {posts.map((post, idx) => (
        <div key={idx} className="bg-white rounded-2xl px-4 py-3 flex justify-between">
          <div className="min-w-0 flex flex-col justify-between">
            <span
              className="text-[10px] font-semibold text-[#5D91FF] bg-[#E9F0FF] rounded-[10px] inline-flex items-center justify-center mb-2"
              style={{ width: '64px', height: '22px' }}
            >
              {post.board}
            </span>
            <h3 className="text-base font-semibold text-black mb-1 truncate">{post.title}</h3>
            <p className="text-xs text-[#8D8D8D] truncate">
              기말고사 시험범위 딱 정리해준다. 수학 어쩌구 영어 어쩌구...
            </p>
          </div>
          <div className="flex flex-col items-end justify-end min-w-[72px] ml-4">
            <span className="text-[11px] text-[#8D8D8D] mb-2">5일 전</span>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1">
                <Image src="/heart.png" alt="like" width={14} height={14} />
                <span className="text-xs text-[#8D8D8D]">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/bubble.png" alt="comment" width={14} height={14} />
                <span className="text-xs text-[#8D8D8D]">{post.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/eye.png" alt="view" width={14} height={14} />
                <span className="text-xs text-[#8D8D8D]">132</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
