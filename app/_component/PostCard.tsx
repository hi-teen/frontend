'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: number;
  title: string;
  board?: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  date?: string;
  compact?: boolean;
  showBoardBadge?: boolean;
}

export default function PostCard({
  id,
  title,
  board,
  content,
  likes = 0,          
  comments = 0,       
  views = 0,          
  date,
  compact = false,
  showBoardBadge = false,
}: PostCardProps) {
  return (
    <div>
      <Link href={`/board/${id}`}>
        <div
          className={
            compact
              ? 'bg-white rounded-xl px-3 py-2 flex justify-between items-center min-h-[38px] shadow-sm hover:bg-gray-50 transition'
              : 'bg-white rounded-2xl px-4 py-3 flex justify-between hover:bg-gray-50 min-h-[76px]'
          }
        >
          <div className="min-w-0 flex flex-col justify-between">
            <div>
              {((showBoardBadge && board) || (!compact && board)) && (
                <span className="text-[10px] font-semibold text-[#5D91FF] bg-[#E9F0FF] px-2.5 py-1 rounded-full inline-block mb-2">
                  {board}
                </span>
              )}
              <h3
                className={
                  compact
                    ? 'text-xs font-medium text-black mb-0 truncate'
                    : 'text-base font-semibold text-black mb-1 truncate'
                }
              >
                {title}
              </h3>
              <p
                className={
                  compact
                    ? 'text-[11px] text-[#8D8D8D] truncate'
                    : 'text-xs text-[#8D8D8D] truncate'
                }
              >
                {content.length > 30 ? `${content.substring(0, 30)}...` : content}
              </p>
            </div>
          </div>
          <div
            className={
              compact
                ? 'flex items-end gap-2 text-[11px] text-[#8D8D8D] ml-3'
                : 'flex flex-col items-end justify-end min-w-[72px] ml-4'
            }
          >
            {date && !compact && (
              <span className="text-[11px] text-[#8D8D8D] mb-2">{date}</span>
            )}
            <div
              className={
                compact
                  ? 'flex gap-2 items-center'
                  : 'flex gap-4 items-center mr-2'
              }
            >
              <div className="flex items-center gap-1">
                <Image
                  src="/heart.png"
                  alt="like"
                  width={compact ? 11 : 14}
                  height={compact ? 11 : 14}
                />
                <span className={compact ? '' : 'text-xs text-[#8D8D8D]'}>
                  {likes}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/bubble.png"
                  alt="comment"
                  width={compact ? 11 : 14}
                  height={compact ? 11 : 14}
                />
                <span className={compact ? '' : 'text-xs text-[#8D8D8D]'}>
                  {comments}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/eye.png"
                  alt="view"
                  width={compact ? 11 : 14}
                  height={compact ? 11 : 14}
                />
                <span className={compact ? '' : 'text-xs text-[#8D8D8D]'}>
                  {views}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
