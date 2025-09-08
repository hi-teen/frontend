import PostCard from './PostCard';
import { memo } from 'react';
import { formatDateTime } from '@/shared/utils/date';

interface HotPost {
  id: number;
  title: string;
  board: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  date?: string;
}

interface Props {
  posts: HotPost[];
}

function HotPostSectionComponent({ posts }: Props) {
  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-xl font-bold">HOT 게시물</h2>
      </div>
      <div className="space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              board={post.board}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
              views={post.views}
              date={formatDateTime(post.date)}
              compact
              showBoardBadge
            />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-sm">🔥 인기글이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

const HotPostSection = memo(HotPostSectionComponent);
export default HotPostSection;
