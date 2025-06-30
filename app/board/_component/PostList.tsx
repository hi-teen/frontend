'use client';

import PostCard from '../../_component/PostCard';
import type { BoardItem } from '@/shared/api/board';

interface Props {
  posts: BoardItem[];
  selectedBoard: string;
}

export default function PostList({ posts, selectedBoard }: Props) {
  const filteredPosts =
    selectedBoard === '전체'
      ? posts
      : posts.filter((post) => post.board === selectedBoard);

  return (
    <div className="px-4 space-y-3">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          board={post.board} // 이미 한글로 통일된 게시판명
          content={post.content}
          likes={post.loveCount}
          comments={0}
          views={0}
        />
      ))}
    </div>
  );
}
