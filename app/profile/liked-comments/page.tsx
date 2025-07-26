// 'use client';

// import { useEffect, useState } from 'react';

// interface LikedComment {
//   id: number;
//   content: string;
//   postTitle?: string;
//   createdAt: string;
// }

// export default function LikedCommentsPage() {
//   const [comments, setComments] = useState<LikedComment[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) return;

//     fetch('https://hiteen.site/api/v1/loves/comments/me', {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => (res.ok ? res.json() : Promise.reject('fail')))
//       .then((res) => {
//         // 실제 응답에 따라 key 매핑 필요
//         if (Array.isArray(res.data)) {
//           setComments(res.data);
//         } else {
//           setComments([]);
//         }
//       })
//       .catch(() => setComments([]))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="max-w-lg mx-auto px-4 pt-5 pb-16">
//       <h1 className="text-lg font-bold mb-4">좋아요한 댓글</h1>
//       {loading ? (
//         <div className="text-gray-400 py-16 text-center">로딩중...</div>
//       ) : comments.length === 0 ? (
//         <div className="text-gray-400 py-16 text-center">좋아요한 댓글이 없습니다.</div>
//       ) : (
//         <ul className="space-y-4">
//           {comments.map((comment) => (
//             <li key={comment.id} className="bg-white rounded-xl shadow px-4 py-3">
//               <div className="text-gray-700 mb-1">{comment.content}</div>
//               {comment.postTitle && (
//                 <div className="text-xs text-gray-400">게시글: {comment.postTitle}</div>
//               )}
//               <div className="text-xs text-gray-300 mt-1">{comment.createdAt.slice(0, 10)}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
