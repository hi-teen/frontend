import { tokenStorage } from '../utils/safeStorage';

// 댓글 작성
export const postComment = async (boardId: number, content: string) => {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const res = await fetch(`/api/v1/comments`, {
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

// 댓글 작성 (createComment와 동일하지만 기존 코드와 호환성을 위해 유지)
export const createComment = async (boardId: number, content: string) => {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const res = await fetch(`/api/v1/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ boardId, content }),
  });

  if (!res.ok) throw new Error('댓글 작성 실패');
  return res.json();
};

// 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const res = await fetch(`/api/v1/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error('댓글 수정 실패');
  return res.json();
};

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const res = await fetch(`/api/v1/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('댓글 삭제 실패');
  return res.json();
};

// 댓글 목록 조회
export const fetchComments = async (boardId: number) => {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const res = await fetch(`/api/v1/comments?boardId=${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('댓글 목록 조회 실패');
  return res.json();
};
  
  export const postReply = async (commentId: number, content: string) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(
      `/api/v1/comments/${commentId}/replies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!res.ok) throw new Error('답글 작성 실패');
    const json = await res.json();
    return json.data;
  };
  
  export async function toggleCommentLike(commentId: number) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
    const res = await fetch(`/api/v1/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('댓글 좋아요 실패');
    const json = await res.json();
    return json.data; // { likeCount: number, liked: boolean }
  }
  