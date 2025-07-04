'use client';

import PostCard from '../../_component/PostCard';
import type { BoardItem } from '@/shared/api/board';

interface Props {
  posts: BoardItem[];
  selectedBoard: string;
}

export default function PostList({ posts, selectedBoard }: Props) {
  return (
    <div className="px-4 space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          board={selectedBoard === 'ALL' ? post.categoryLabel : ''}
          content={post.content}
          likes={post.loveCount}
          comments={0}
          views={0}
        />
      ))}
    </div>
  );
}
