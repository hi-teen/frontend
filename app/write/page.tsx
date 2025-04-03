"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log({ title, content });
    router.push("/");
  };

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-4 mb-8'>
        <button
          onClick={() => router.back()}
          className='p-2 hover:bg-gray-100 rounded-full'
        >
          <ArrowLeftIcon className='w-6 h-6' />
        </button>
        <h1 className='text-2xl font-bold'>새 글 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <input
            type='text'
            placeholder='제목을 입력하세요'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div>
          <textarea
            placeholder='내용을 입력하세요'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='w-full h-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            required
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors'
          >
            게시하기
          </button>
        </div>
      </form>
    </main>
  );
}
