import PostCard from './PostCard';

function formatDateTime(datetime?: string) {
  if (!datetime) return '';
  const [date, time] = datetime.split(/[ T]/);
  if (!date || !time) return datetime;
  const [year, month, day] = date.split('-');
  const [hh, mm] = time.split(':');
  return `${year.slice(2)}/${month}/${day} ${hh}:${mm}`;
}

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
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            views={post.views}
            date={formatDateTime(post.date)}
          />
        ))}
      </div>
    </div>
  );
}
