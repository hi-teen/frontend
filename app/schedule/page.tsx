"use client";

import Link from "next/link";
import Image from "next/image";

interface Schedule {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  period: number;
  day: number;
}

export default function SchedulePage() {
  // 임시 시간표 데이터
  const schedule: Schedule[] = [
    {
      id: 1,
      subject: "국어",
      teacher: "김선생",
      room: "2-3",
      period: 1,
      day: 1,
    },
    {
      id: 2,
      subject: "수학",
      teacher: "이선생",
      room: "2-3",
      period: 2,
      day: 1,
    },
    {
      id: 3,
      subject: "영어",
      teacher: "박선생",
      room: "어학실",
      period: 3,
      day: 1,
    },
    // ... 더 많은 수업 데이터
  ];

  const days = ["월", "화", "수", "목", "금"];
  const periods = [
    { period: 1, time: "09:00 - 09:50" },
    { period: 2, time: "10:00 - 10:50" },
    { period: 3, time: "11:00 - 11:50" },
    { period: 4, time: "12:00 - 12:50" },
    { period: 5, time: "14:00 - 14:50" },
    { period: 6, time: "15:00 - 15:50" },
  ];

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-2 flex items-center bg-white sticky top-0 z-50 border-b'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='flex items-center'>
            <Image src='/logo.svg' alt='Logo' width={28} height={28} />
          </Link>
          <div className='flex flex-col'>
            <span className='font-bold text-sm'>서울고등학교</span>
            <span className='text-xs text-gray-500'>2학년 3반</span>
          </div>
        </div>
      </header>

      <div className='p-4'>
        {/* 시간표 */}
        <div className='overflow-x-auto bg-white rounded-lg shadow-sm'>
          <table className='w-full min-w-[640px]'>
            <thead>
              <tr>
                <th className='p-3 text-center w-24 bg-hiteen-pink-400 text-white rounded-tl-lg'>
                  교시
                </th>
                {days.map((day, index) => (
                  <th
                    key={day}
                    className={`p-3 text-center bg-hiteen-pink-400 text-white ${
                      index === days.length - 1 ? "rounded-tr-lg" : ""
                    }`}
                  >
                    {day}요일
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((periodInfo) => (
                <tr key={periodInfo.period}>
                  <td className='p-3 text-center font-medium border-r bg-hiteen-pink-50'>
                    <div>{periodInfo.period}교시</div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {periodInfo.time}
                    </div>
                  </td>
                  {days.map((day, dayIndex) => {
                    const lesson = schedule.find(
                      (s) =>
                        s.day === dayIndex + 1 && s.period === periodInfo.period
                    );
                    return (
                      <td
                        key={day}
                        className='p-3 border-b hover:bg-gray-50 transition-colors'
                      >
                        {lesson ? (
                          <div className='text-center'>
                            <div className='font-medium text-hiteen-pink-500'>
                              {lesson.subject}
                            </div>
                            <div className='text-sm text-gray-500 mt-1'>
                              {lesson.teacher}
                            </div>
                            <div className='text-xs text-gray-400 mt-0.5'>
                              {lesson.room}
                            </div>
                          </div>
                        ) : (
                          <div className='text-center text-gray-300'>-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <nav className='fixed bottom-0 left-0 right-0 bg-white border-t'>
        <div className='max-w-lg mx-auto grid grid-cols-4'>
          <Link
            href='/'
            className='flex flex-col items-center justify-center py-3 text-gray-500 hover:text-hiteen-pink-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            <span className='text-[10px] mt-1'>홈</span>
          </Link>
          <Link
            href='/meal'
            className='flex flex-col items-center justify-center py-3 text-gray-500 hover:text-hiteen-pink-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
            <span className='text-[10px] mt-1'>급식</span>
          </Link>
          <Link
            href='/messages'
            className='flex flex-col items-center justify-center py-3 text-gray-500 hover:text-hiteen-pink-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
              />
            </svg>
            <span className='text-[10px] mt-1'>알림장</span>
          </Link>
          <Link
            href='/profile'
            className='flex flex-col items-center justify-center py-3 text-gray-500 hover:text-hiteen-pink-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
            <span className='text-[10px] mt-1'>프로필</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
