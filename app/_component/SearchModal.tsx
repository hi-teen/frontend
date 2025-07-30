'use client';

import { useState, useEffect, useRef } from 'react';
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

// 검색 결과 API 타입 변환 함수
function mapApiToPost(item: any): Post {
  return {
    id: item.id,
    title: item.title,
    board: item.categoryLabel,
    content: item.content,
    likes: item.loveCount,
    comments: 0, // 댓글 수는 필요하다면 API에서 받아와서 할당
    views: item.viewCount,
    date: item.createdAt
      ? item.createdAt.slice(2, 10).replace(/-/g, '/') // 25/07/25
      : '',
  };
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  // 디바운싱 검색
  useEffect(() => {
    if (!touched) return;
    if (!keyword.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const token = localStorage.getItem('accessToken');
      fetch(
        `https://hiteen.site/api/v1/boards/search?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      )
        .then((res) => (res.ok ? res.json() : Promise.reject('검색 실패')))
        .then((res) => {
          if (Array.isArray(res.data)) {
            setPosts(res.data.map(mapApiToPost));
          } else {
            setPosts([]);
          }
        })
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
    }, 350);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [keyword, touched]);

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
          onFocus={() => setTouched(true)}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm mb-4"
        />
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {!touched ? (
            <p className="text-sm text-gray-400">검색어를 입력하세요.</p>
          ) : loading ? (
            <p className="text-sm text-gray-500">검색 중...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} {...post} />)
          )}
        </div>
      </div>
    </div>
  );
}
