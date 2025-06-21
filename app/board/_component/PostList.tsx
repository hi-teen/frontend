import PostCard from '../../_component/PostCard';
import type { BoardItem } from '@/shared/api/board';

interface Props {
  posts: BoardItem[];
}

export default function PostList({ posts }: Props) {
  return (
    <div className="px-4 space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          board={'자유게시판'}
          content={post.content}
          likes={post.loveCount}
          comments={0}
          views={0}
        />
      ))}
    </div>
  );
}
