import BoardHeader from './_component/BoardHeader';
import PostList from './_component/PostList';

const dummyPosts = Array(10).fill({
  id: 1,
  title: '기말고사 시험 범위 정리',
  board: '자유게시판',
  likes: 50,
  comments: 27,
});

export default function BoardPage() {
  return (
    <main className="max-w-lg mx-auto bg-gray-50 pb-24">
      <BoardHeader />
      <PostList posts={dummyPosts} />
    </main>
  );
}
