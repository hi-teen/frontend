'use client';

import PostCard from './PostCard';
import { BoardItem } from '@/shared/api/board';

interface Board {
  key: string;
  label: string;
  emoji: string;
}

interface Props {
  boards: Board[];
  posts: Record<string, BoardItem[]>;
  selected: string;
  setSelected: (key: string) => void;
}

export default function FavoriteBoardSection({
  boards,
  posts,
  selected,
  setSelected,
}: Props) {
  // 즐겨찾기한 게시판이 없는 경우
  if (boards.length === 0) {
    return (
      <div className='px-4 pb-4'>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='text-xl font-bold'>즐겨찾는 게시판</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
            <span className="text-base">📋</span>
            즐겨찾기한 게시판이 없습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 pb-4'>
      <div className='flex justify-between items-center mb-3'>
        <h2 className='text-xl font-bold'>즐겨찾는 게시판</h2>
      </div>
      {/* 게시판 선택 버튼 - 한 줄 슬라이드 */}
      <div className="overflow-x-auto scrollbar-hide mb-4">
        <div className="flex items-center gap-2 flex-nowrap min-w-max">
          {boards.map((board) => {
            const isActive = selected === board.key;
            return (
              <button
                key={board.key}
                onClick={() => setSelected(board.key)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-semibold transition whitespace-nowrap
                  ${isActive
                    ? 'border-[#417EFF] text-[#417EFF]'
                    : 'border-[#EAEAEA] text-[#A2A2A2]'
                  } bg-white`}
              >
                <span className="text-lg">{board.emoji}</span>
                {board.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 게시글 목록: 개별 흰 박스, 콤팩트 모드 */}
      <div className="space-y-2">
        {(posts[selected] ?? [])
          .slice(-3)  // 뒤에서 3개 (최신 3개)
          .map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              likes={post.loveCount}
              comments={post.commentCount}
              views={post.viewCount}
              compact
            />
          ))}
      </div>
    </div>
  );
}
