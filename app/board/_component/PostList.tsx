import PostCard from '../../_component/PostCard';

interface Post {
  id: number;
  title: string;
  board: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
}

interface Props {
  posts: Post[];
}

export default function PostList({ posts }: Props) {
  return (
    <div className="px-4 space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          board={post.board}
          content={post.content}
          likes={post.likes}
          comments={post.comments}
          views={post.views}
        />
      ))}
    </div>
  );
}
