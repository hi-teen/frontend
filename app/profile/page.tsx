"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  content: string;
  board: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

interface Comment {
  id: string;
  content: string;
  postTitle: string;
  board: string;
  timestamp: Date;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const myPosts: Post[] = [
    {
      id: "1",
      title: "수학 시험 범위 질문",
      content: "다음 주 시험 범위가 어디까지인가요?",
      board: "2학년 게시판",
      likes: 5,
      comments: 3,
      timestamp: new Date("2024-04-03T10:30:00"),
    },
    {
      id: "2",
      title: "급식 건의사항",
      content: "매운 음식이 너무 많아서 조절해주시면 감사하겠습니다.",
      board: "급식게시판",
      likes: 10,
      comments: 2,
      timestamp: new Date("2024-04-02T15:45:00"),
    },
  ];

  const myComments: Comment[] = [
    {
      id: "1",
      content: "저도 같은 생각입니다!",
      postTitle: "급식 건의사항",
      board: "급식게시판",
      timestamp: new Date("2024-04-03T11:20:00"),
    },
    {
      id: "2",
      content: "3단원까지입니다.",
      postTitle: "수학 시험 범위 질문",
      board: "2학년 게시판",
      timestamp: new Date("2024-04-02T16:30:00"),
    },
  ];

  const tabItems = [
    { id: "posts", label: "내 글", icon: DocumentTextIcon },
    { id: "comments", label: "내 댓글", icon: ChatBubbleLeftIcon },
  ] as const;

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-50 border-b'>
        <Link href='/'>
          <ArrowLeftIcon className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-bold'>프로필</h1>
      </header>

      <div className='p-4'>
        {/* 프로필 정보 */}
        <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
          <div className='flex items-center gap-4'>
            <div className='relative w-16 h-16 rounded-full overflow-hidden bg-gray-100'>
              <Image
                src='/default-profile.svg'
                alt='프로필 이미지'
                fill
                className='object-cover'
              />
            </div>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='font-medium'>김철수</h2>
                  <p className='text-sm text-gray-500'>2학년 3반</p>
                </div>
                <Link
                  href='/profile/edit'
                  className='flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full'
                >
                  <PencilIcon className='w-4 h-4' />
                  <span>수정</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          {/* 탭 메뉴 */}
          <div className='w-1/3'>
            <div className='bg-white rounded-lg shadow-sm'>
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? "text-hiteen-pink-400 bg-hiteen-pink-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className='w-5 h-5' />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 게시글/댓글 목록 */}
          <div className='flex-1 space-y-2'>
            {activeTab === "posts"
              ? myPosts.map((post) => (
                  <div
                    key={post.id}
                    className='bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3 className='font-medium mb-1'>{post.title}</h3>
                        <p className='text-sm text-gray-600 line-clamp-2'>
                          {post.content}
                        </p>
                      </div>
                      <span className='text-xs text-gray-500 whitespace-nowrap ml-2'>
                        {format(post.timestamp, "M.d HH:mm", { locale: ko })}
                      </span>
                    </div>
                    <div className='flex items-center gap-4 text-xs text-gray-500'>
                      <span>{post.board}</span>
                      <span>좋아요 {post.likes}</span>
                      <span>댓글 {post.comments}</span>
                    </div>
                  </div>
                ))
              : myComments.map((comment) => (
                  <div
                    key={comment.id}
                    className='bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <h3 className='text-sm text-gray-500 mb-1'>
                          {comment.postTitle}
                        </h3>
                        <p className='text-sm line-clamp-2'>
                          {comment.content}
                        </p>
                      </div>
                      <span className='text-xs text-gray-500 whitespace-nowrap ml-2'>
                        {format(comment.timestamp, "M.d HH:mm", { locale: ko })}
                      </span>
                    </div>
                    <div className='text-xs text-gray-500'>{comment.board}</div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </main>
  );
}
