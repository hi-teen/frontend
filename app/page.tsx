"use client";

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

export default function Home() {
  const today = new Date();
  const formattedDate = format(today, "M월 d일 (EEEE)", { locale: ko });

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
          {/* <Link href='/profile'>
            <div className='w-8 h-8 bg-hiteen-pink-100 rounded-full' />
          </Link> */}
        </div>
      </header>

      {/* 공지사항 배너 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
        {/* 오늘의 급식 카드 */}
        <div className='bg-white border-[1.5px] border-[#E9F0FF] p-4 rounded-xl'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center gap-2'>
            <Image
              src='/lunchbox.png'
              alt='급식 아이콘'
              width={40}
              height={40}
            />
            <div>
              <h3 className='text-lg font-bold'>오늘의 급식</h3>
              <p className='text-xs text-gray-500 mt-0.5'>{formattedDate}</p>
            </div>
          </div>
          {/* <Link href='/meal'> */}
          <span className='text-sm text-[#525252] font-semibold translate-y-2.5 -translate-x-2 block'>
            이번주 급식표
          </span>
          {/* </Link> */}
        </div>

        <div className='space-y-3 pl-4'>
          <div>
            <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block'>
              중식
            </span>
            <p className='text-sm text-gray-800 mt-2 font-semibold'>
              {todayMeals.lunch.join(", ")}
            </p>
          </div>
          <div>
            <span className='text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mt-1'>
              석식
            </span>
            <p className='text-sm text-gray-800 mt-2 font-semibold'>
              {todayMeals.dinner.join(", ")}
            </p>
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
        <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-12 h-12 bg-hiteen-pink-100 rounded-lg flex items-center justify-center'>
            <HomeIcon className='w-6 h-6 text-hiteen-pink-400' />
          </div>
          <span className='text-xs whitespace-nowrap'>학교 홈</span>
        </button>
        <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-12 h-12 bg-hiteen-pink-100 rounded-lg flex items-center justify-center'>
            <TruckIcon className='w-6 h-6 text-hiteen-pink-400' />
          </div>
          <span className='text-xs whitespace-nowrap'>셔틀버스</span>
        </button>
        <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-12 h-12 bg-hiteen-pink-100 rounded-lg flex items-center justify-center'>
            <DocumentTextIcon className='w-6 h-6 text-hiteen-pink-400' />
          </div>
          <span className='text-xs whitespace-nowrap'>학사공지</span>
        </button>
        <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-12 h-12 bg-hiteen-pink-100 rounded-lg flex items-center justify-center'>
            <CalendarIcon className='w-6 h-6 text-hiteen-pink-400' />
          </div>
          <span className='text-xs whitespace-nowrap'>학사일정</span>
        </button>
        <button className='flex flex-col items-center gap-1 min-w-[4rem]'>
          <div className='w-12 h-12 bg-hiteen-pink-100 rounded-lg flex items-center justify-center'>
            <BookOpenIcon className='w-6 h-6 text-hiteen-pink-400' />
          </div>
          <span className='text-xs whitespace-nowrap'>도서관</span>
        </button>
      </div>

      {/* 광고 배너 */}
      <div className='bg-hiteen-pink-50 mx-4 rounded-lg p-4 mb-6'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 bg-hiteen-pink-100 rounded flex items-center justify-center flex-shrink-0'>
            <span className='text-hiteen-pink-400 font-bold'>AD</span>
          </div>
          <div className='min-w-0'>
            <h3 className='font-bold text-base sm:text-lg truncate'>
              낭코대전쟁 1억 다운로드
            </h3>
            <p className='text-sm line-clamp-2'>
              돌파 기념 이벤트 개최 중이다냥!
            </p>
          </div>
        </div>
      </div>

      {/* 핫게시물 */}
      <div className='px-4 mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <FireIcon className='w-5 h-5 text-hiteen-pink-400' />
            <h2 className='text-lg font-bold'>HOT 게시물</h2>
          </div>
          <button className='text-hiteen-pink-400 whitespace-nowrap'>
            더 보기 &gt;
          </button>
        </div>
        <div className='space-y-4'>
          {hotPosts.map((post) => (
            <div key={post.id} className='bg-white p-4 rounded-lg shadow-sm'>
              <div className='flex justify-between items-start gap-4'>
                <div className='min-w-0'>
                  <span className='text-xs text-hiteen-pink-400 bg-hiteen-pink-100 px-2 py-0.5 rounded-full inline-block mb-2'>
                    {post.board}
                  </span>
                  <h3 className='font-medium truncate'>{post.title}</h3>
                </div>
                <div className='text-xs text-gray-500 space-y-1 text-right flex-shrink-0'>
                  <p>👍 {post.likes}</p>
                  <p>💬 {post.comments}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 게시판 목록 */}
      <div className='px-4 pb-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold'>즐겨찾는 게시판</h2>
          <button className='text-hiteen-pink-400 whitespace-nowrap'>
            더 보기 &gt;
          </button>
        </div>
        <div className='space-y-4'>
          <Link
            href='/board/free'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>자유게시판</span>
            <span className='text-hiteen-pink-400 text-sm'>N</span>
          </Link>
          <Link
            href='/board/secret'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>비밀게시판</span>
            <span className='text-sm'>23</span>
          </Link>
          <Link
            href='/board/1st'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>1학년 게시판</span>
            <span className='text-hiteen-pink-400 text-sm'>N</span>
          </Link>
          <Link
            href='/board/2nd'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>2학년 게시판</span>
            <span className='text-sm'>19</span>
          </Link>
          <Link
            href='/board/3rd'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>3학년 게시판</span>
            <span className='text-hiteen-pink-400 text-sm'>N</span>
          </Link>
          <Link
            href='/board/exam'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>시험정보</span>
            <span className='text-hiteen-pink-400 text-sm'>N</span>
          </Link>
          <Link
            href='/board/market'
            className='flex justify-between items-center py-2 border-b'
          >
            <span>장터게시판</span>
            <span className='text-hiteen-pink-400 text-sm'>N</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
