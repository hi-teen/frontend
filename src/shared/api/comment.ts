export const fetchComments = async (boardId: number) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`https://hiteen.site/api/v1/comments/board/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert('로그인이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return;
      }
      throw new Error('댓글 불러오기 실패');
    }
  
    const json = await res.json();
    return json.data;
  };
  
  
  export const postComment = async (boardId: number, content: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`https://hiteen.site/api/v1/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ boardId, content }),
    });
    if (!res.ok) throw new Error('댓글 작성 실패');
    const json = await res.json();
    return json.data;
  };
  
  export const postReply = async (commentId: number, content: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`https://hiteen.site/api/v1/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('답글 작성 실패');
    const json = await res.json();
    return json.data.replies.at(-1); // 마지막 대댓글 반환
  };
  
  export async function toggleCommentLike(commentId: number) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
    const res = await fetch(`https://hiteen.site/api/v1/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('댓글 좋아요 실패');
    const json = await res.json();
    return json.data; // { likeCount: number, liked: boolean }
  }
  