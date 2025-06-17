import PostCard from './PostCard';

interface HotPost {
  id: number;
  title: string;
  board: string;
  likes: number;
  comments: number;
}

interface Props {
  posts: HotPost[];
}

export default function HotPostSection({ posts }: Props) {
  return (
    <div className="px-4 mb-8">
      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-xl font-bold">HOT 게시물</h2>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            board={post.board}
            content="기말고사 시험범위 딱 정리해준다. 수학 어쩌구 영어 어쩌구..."
            likes={post.likes}
            comments={post.comments}
            views={132}
            date="5일 전"
          />
        ))}
      </div>
    </div>
  );
}
