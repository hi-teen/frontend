'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PostCard from './PostCard';

interface Post {
  id: number;
  title: string;
  board: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  date?: string;
}

interface SearchModalProps {
  onClose: () => void;
}

interface Props {
    onClose: () => void;
  }

const dummyPosts: Post[] = [
  {
    id: 1,
    title: '종강 언제에요?',
    board: '자유게시판',
    content: '정확한 일정 아시는 분?',
    likes: 10,
    comments: 2,
    views: 120,
    date: '3일 전',
  },
  {
    id: 2,
    title: '시험 범위 공유해요',
    board: '정보게시판',
    content: '수학은 3단원까지래요',
    likes: 4,
    comments: 3,
    views: 89,
    date: '5일 전',
  },
];

export default function SearchModal({ onClose }: SearchModalProps) {
  const [keyword, setKeyword] = useState('');

  const filteredPosts = dummyPosts.filter((post) =>
    post.title.includes(keyword) || post.content.includes(keyword)
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-20 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">게시글 검색</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm mb-4"
        />
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
          )}
        </div>
      </div>
    </div>
  );
}
