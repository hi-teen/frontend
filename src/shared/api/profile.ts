import { BoardItem } from './board';

async function safeParseListResponse(res: Response, errorMsg: string) {
  const contentType = res.headers.get('content-type');
  const text = await res.text();
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    try {
      data = JSON.parse(text);
    } catch {}
  }
  if (!res.ok) {
    throw new Error(text || errorMsg);
  }
  if (!data) throw new Error('서버 응답이 JSON 형식이 아님');
  return data;
}

export const fetchMyPosts = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/boards/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return safeParseListResponse(res, '내 게시글 불러오기 실패');
};

interface MyCommentItem {
  commentId: number;
  content: string;
  boardId: number;
  boardTitle: string;
  createdDate: string;
}

export const fetchMyComments = async (): Promise<MyCommentItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/comments/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return safeParseListResponse(res, '내 댓글 불러오기 실패');
};

export const fetchMyScraps = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/scraps/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return safeParseListResponse(res, '스크랩 글 불러오기 실패');
};

export const fetchMyLikes = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/loves/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return safeParseListResponse(res, '좋아요한 글 불러오기 실패');
};
