"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function ProfileEditPage() {
  const [name, setName] = useState("김철수");
  const [grade, setGrade] = useState("2");
  const [class_, setClass] = useState("3");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 프로필 정보 업데이트 로직 구현
    window.location.href = "/profile";
  };

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-50 border-b'>
        <Link href='/profile'>
          <ArrowLeftIcon className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-bold'>프로필 수정</h1>
      </header>

      <form onSubmit={handleSubmit} className='p-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
          <div className='flex flex-col items-center gap-4'>
            <div className='relative w-24 h-24 rounded-full overflow-hidden bg-gray-100'>
              <Image
                src='/default-profile.svg'
                alt='프로필 이미지'
                fill
                className='object-cover'
              />
              <button
                type='button'
                className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity'
              >
                이미지 변경
              </button>
            </div>

            <div className='w-full space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  이름
                </label>
                <input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hiteen-pink-400 focus:border-transparent'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='grade'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    학년
                  </label>
                  <select
                    id='grade'
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hiteen-pink-400 focus:border-transparent'
                  >
                    <option value='1'>1학년</option>
                    <option value='2'>2학년</option>
                    <option value='3'>3학년</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='class'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    반
                  </label>
                  <select
                    id='class'
                    value={class_}
                    onChange={(e) => setClass(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hiteen-pink-400 focus:border-transparent'
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}반
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-hiteen-pink-400 text-white py-3 rounded-lg font-medium hover:bg-hiteen-pink-500 transition-colors'
        >
          저장하기
        </button>
      </form>
    </main>
  );
}
