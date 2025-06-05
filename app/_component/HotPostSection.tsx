'use client';
import Image from "next/image";

interface HotPost {
  id: number;
  title: string;
  board: string;
  likes: number;
  comments: number;
}

interface Props {
  posts: HotPost[];
}

export default function HotPostSection({ posts }: Props) {
  return (
    <div className='px-4 mb-8'>
      <div className='flex justify-between items-center mt-2 mb-4'>
        <h2 className='text-xl font-bold'>HOT 게시물</h2>
        <button className='text-[#417EFF] text-sm font-semibold whitespace-nowrap'>더 보기 &gt;</button>
      </div>
      <div className='space-y-4'>
        {posts.map((post) => (
          <div key={post.id} className='bg-white rounded-2xl px-4 py-3 flex justify-between shadow-sm'>
            <div className='min-w-0 flex flex-col justify-between'>
              <div>
                <span className='text-[10px] font-semibold text-[#5D91FF] bg-[#E9F0FF] px-2.5 py-1 rounded-full inline-block mb-2'>{post.board}</span>
                <h3 className='text-base font-semibold text-black mb-1 truncate'>{post.title}</h3>
                <p className='text-xs text-[#8D8D8D] truncate'>기말고사 시험범위 딱 정리해준다. 수학 어쩌구 영어 어쩌구...</p>
              </div>
            </div>
            <div className='flex flex-col items-end justify-end min-w-[72px] ml-4'>
              <span className='text-[11px] text-[#8D8D8D] mb-2'>5일 전</span>
              <div className='flex gap-2 items-center'>
                <div className='flex items-center gap-1'>
                  <Image src='/heart.png' alt='like' width={14} height={14} />
                  <span className='text-xs text-[#8D8D8D]'>{post.likes}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Image src='/bubble.png' alt='comment' width={14} height={14} />
                  <span className='text-xs text-[#8D8D8D]'>{post.comments}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Image src='/eye.png' alt='view' width={14} height={14} />
                  <span className='text-xs text-[#8D8D8D]'>132</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}