"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  BellIcon,
  HomeIcon,
  TruckIcon,
  DocumentTextIcon,
  CalendarIcon,
  BookOpenIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const boards = [
  { key: 'free', label: '자유게시판', icon: '/smile.png' },
  { key: 'secret', label: '비밀게시판', icon: '/secret.png' },
  { key: 'info', label: '정보게시판', icon: '/light.png' },
  { key: '1st', label: '1학년게시판', icon: '/first.png' },
];

const posts = [
  { id: 1, title: '종강 6월 16일인가요?', likes: 1, comments: 13 },
  { id: 2, title: '종강 6월 16일인가요?', likes: 1, comments: 13 },
  { id: 3, title: '종강 6월 16일인가요?', likes: 1, comments: 13 },
  { id: 4, title: '종강 6월 16일인가요?', likes: 1, comments: 13 },
];

export default function Home() {
  const today = new Date();
  const formattedDate = format(today, "M월 d일 (EEEE)", { locale: ko });
  const [selected, setSelected] = useState("free");

  const todayMeals = {
    lunch: ["백미밥", "된장국", "돈까스", "양배추샐러드", "깍두기", "딸기"],
    dinner: ["백미밥", "김치찌개", "고등어구이", "시금치나물", "김치"],
  };

  const hotPosts = [
    {
      id: 1,
      title: "기말고사 시험범위 정리",
      board: "시험정보",
      likes: 128,
      comments: 45,
    },
    {
      id: 2,
      title: "급식실 새 메뉴 리뷰",
      board: "자유게시판",
      likes: 98,
      comments: 32,
    },
    {
      id: 3,
      title: "교복 공동구매 하실 분",
      board: "장터게시판",
      likes: 76,
      comments: 28,
    },
  ];

  return (
    <main className='pb-16 max-w-lg mx-auto'>
      {/* 상단 헤더 */}
      <header className='px-4 pt-5 pb-3 flex justify-between items-start bg-gray-50 sticky top-0 z-50'>
        <div className='flex flex-col'>
          <Link href='/'>
            <Image
              src='/hiteen.svg'
              alt='HiTeen 로고'
              width={72}
              height={24}
              className='object-contain'
              priority
              style={{ display: 'block' }}
            />
          </Link>
          <span className='text-xl font-bold text-black mt-1'>한국고등학교</span>
        </div>
        <div className='flex items-center gap-4 mt-3'>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 text-gray-400'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4.5v15m7.5-7.5h-15'
              />
            </svg>
          </button>
          <button>
            <MagnifyingGlassIcon className='w-6 h-6 text-gray-400' />
          </button>
          <button className='relative'>
            <BellIcon className='w-6 h-6 text-gray-400' />
            <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center'>
              6
            </span>
          </button>
        </div>
      </header>

      {/* 오늘의 급식 카드 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
        <div className='bg-white border-[1.5px] border-[#E9F0FF] p-4 rounded-xl'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex items-center gap-2'>
              <Image src='/lunchbox.png' alt='급식 아이콘' width={40} height={40} />
              <div>
                <h3 className='text-lg font-bold'>오늘의 급식</h3>
                <p className='text-xs text-gray-500 mt-0.5'>{formattedDate}</p>
              </div>
            </div>
            <span className='text-sm text-[#525252] font-semibold translate-y-2.5 -translate-x-2 block'>
              이번주 급식표
            </span>
          </div>
          <div className='space-y-3 pl-4'>
            <div>
              <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1'>중식</span>
              <p className='text-sm text-gray-800 mt-1 font-semibold'>{todayMeals.lunch.join(", ")}</p>
            </div>
            <div>
              <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1 mt-1'>석식</span>
              <p className='text-sm text-gray-800 mt-1 font-semibold'>{todayMeals.dinner.join(", ")}</p>
            </div>
          </div>
          <div className='flex justify-center gap-1 mt-4'>
            <span className='w-2 h-2 rounded-full bg-[#5A8FFF] opacity-60' />
            <span className='w-2 h-2 rounded-full bg-[#D9D9D9]' />
            <span className='w-2 h-2 rounded-full bg-[#D9D9D9]' />
            <span className='w-2 h-2 rounded-full bg-[#D9D9D9]' />
          </div>
        </div>
      </div>

      {/* 퀵 메뉴 */}
      <div className='grid grid-cols-5 gap-2 px-4 py-6 overflow-x-auto hide-scrollbar'>
        {[
          { src: '/homeicon.png', label: '학교 홈' },
          { src: '/announcement.png', label: '학사공지' },
          { src: '/library.png', label: '도서관' },
          { src: '/bus.png', label: '셔틀버스' },
          { src: '/schedule.png', label: '학사일정' },
        ].map(({ src, label }) => (
          <button key={label} className='flex flex-col items-center gap-1 min-w-[4rem]'>
            <div className='w-[72px] h-[72px] bg-[#E9F0FF] rounded-[10px] flex items-center justify-center'>
              <Image src={src} alt={label} width={44} height={44} />
            </div>
            <span className='text-xs text-[#656565] font-semibold whitespace-nowrap'>{label}</span>
          </button>
        ))}
      </div>

      {/* 즐겨찾는 게시판 */}
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
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition
          ${isActive ? 'border-[#417EFF] text-[#417EFF]' : 'border-[#A2A2A2] text-[#A2A2A2]'} bg-white`}
      >
        <Image src={board.icon} alt={board.label} width={16} height={16} />
        {board.label}
      </button>
    );
  })}
  <button className='text-[#417EFF] text-sm font-semibold whitespace-nowrap'>
    더 보기 &gt;
  </button>
</div>

        <div className='bg-white rounded-xl p-4 space-y-4'>
          {posts.map((post) => (
            <div
              key={post.id}
              className='flex justify-between items-center text-sm text-[#3D3D3D]'
            >
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

      {/* 핫 게시물 */}
      <div className='px-4 mb-8'>
        <div className='flex justify-between items-center mt-2 mb-4'>
          <h2 className='text-xl font-bold'>HOT 게시물</h2>
          <button className='text-[#417EFF] text-sm font-semibold whitespace-nowrap'>
            더 보기 &gt;
          </button>
        </div>

        <div className='space-y-4'>
          {[1, 2].map((_, idx) => (
            <div
              key={idx}
              className='bg-white rounded-2xl px-4 py-3 flex justify-between shadow-sm'
            >
              {/* 왼쪽 콘텐츠 */}
              <div className='min-w-0 flex flex-col justify-between'>
                <div>
                  <span className='text-[10px] font-semibold text-[#5D91FF] bg-[#E9F0FF] px-2.5 py-1 rounded-full inline-block mb-2'>
                    자유게시판
                  </span>
                  <h3 className='text-base font-semibold text-black mb-1 truncate'>
                    기말고사 시험 범위 정리
                  </h3>
                  <p className='text-xs text-[#8D8D8D] truncate'>
                    기말고사 시험범위 딱 정리해준다. 수학 어쩌구 영어 어쩌구...
                  </p>
                </div>
              </div>

              {/* 오른쪽 아이콘 */}
              <div className='flex flex-col items-end justify-end min-w-[72px] ml-4'>
                <span className='text-[11px] text-[#8D8D8D] mb-2'>5일 전</span>
                <div className='flex gap-2 items-center'>
                  <div className='flex items-center gap-1'>
                    <Image src='/heart.png' alt='like' width={14} height={14} />
                    <span className='text-xs text-[#8D8D8D]'>50</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Image src='/bubble.png' alt='comment' width={14} height={14} />
                    <span className='text-xs text-[#8D8D8D]'>27</span>
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

      {/* 교내 홍보 */}
      <div className='px-4 mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>교내 홍보</h2>
          <button className='text-[#417EFF] text-sm font-semibold whitespace-nowrap'>
            더 보기 &gt;
          </button>
        </div>

        <div className='flex gap-3 overflow-x-auto hide-scrollbar'>
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className='w-[160px] h-[180px] rounded-xl bg-white flex-shrink-0'
            />
          ))}
        </div>
      </div>
    </main>
  );
}
