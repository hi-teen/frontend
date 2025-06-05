'use client';
import Image from "next/image";

interface Board {
  key: string;
  label: string;
  icon: string;
}

interface Post {
  id: number;
  title: string;
  likes: number;
  comments: number;
}

interface Props {
  boards: Board[];
  posts: Post[];
  selected: string;
  setSelected: (key: string) => void;
}

export default function FavoriteBoardSection({ boards, posts, selected, setSelected }: Props) {
  return (
    <div className='px-4 pb-4'>
      <div className='flex justify-between items-center mb-3'>
        <h2 className='text-xl font-bold'>즐겨찾는 게시판</h2>
      </div>
      <div className='flex items-center gap-2 mb-4 flex-wrap'>
        {boards.map((board) => {
          const isActive = selected === board.key;
          return (
            <button
              key={board.key}
              onClick={() => setSelected(board.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${isActive ? 'border-[#417EFF] text-[#417EFF]' : 'border-[#A2A2A2] text-[#A2A2A2]'} bg-white`}
            >
              <Image src={board.icon} alt={board.label} width={16} height={16} />
              {board.label}
            </button>
          );
        })}
      </div>
      <div className='bg-white rounded-xl p-4 space-y-4'>
        {posts.map((post) => (
          <div key={post.id} className='flex justify-between items-center text-sm text-[#3D3D3D]'>
            <p className='truncate'>{post.title}</p>
            <div className='flex items-center gap-3 text-xs text-gray-500 flex-shrink-0'>
              <div className='flex items-center gap-1'>
                <Image src='/heart.png' alt='like' width={14} height={14} />
                {post.likes}
              </div>
              <div className='flex items-center gap-1'>
                <Image src='/bubble.png' alt='comment' width={14} height={14} />
                {post.comments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}