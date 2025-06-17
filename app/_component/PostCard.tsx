'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: number;
  title: string;
  board: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  date?: string; // 예: "5일 전"
}

export default function PostCard({
  id,
  title,
  board,
  content,
  likes,
  comments,
  views,
  date,
}: PostCardProps) {
  return (
    <div>
      <Link href={`/board/${id}`}>
        <div className="bg-white rounded-2xl px-4 py-3 flex justify-between hover:bg-gray-50">
          <div className="min-w-0 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#5D91FF] bg-[#E9F0FF] px-2.5 py-1 rounded-full inline-block mb-2">
                {board}
              </span>
              <h3 className="text-base font-semibold text-black mb-1 truncate">
                {title}
              </h3>
              <p className="text-xs text-[#8D8D8D] truncate">{content}</p>
            </div>
          </div>
          <div className="flex flex-col items-end justify-end min-w-[72px] ml-4">
            {date && <span className="text-[11px] text-[#8D8D8D] mb-2">{date}</span>}
            <div className="flex gap-2 items-center mr-2">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1">
                  <Image src="/heart.png" alt="like" width={14} height={14} />
                  <span className="text-xs text-[#8D8D8D]">{likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/bubble.png" alt="comment" width={14} height={14} />
                  <span className="text-xs text-[#8D8D8D]">{comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image src="/eye.png" alt="view" width={14} height={14} />
                  <span className="text-xs text-[#8D8D8D]">{views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
