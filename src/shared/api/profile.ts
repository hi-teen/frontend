import { BoardItem } from './board';

// 응답 파싱 및 에러 처리 공통 함수
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
  if (!data || !Array.isArray(data.data)) {
    throw new Error('서버 응답이 JSON 형식이 아니거나 data 배열이 아님');
  }
  return data.data;
}

// 내가 쓴 게시글
export const fetchMyPosts = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/boards/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '내 게시글 불러오기 실패');
};

// 내가 쓴 댓글/대댓글
export interface MyCommentItem {
  commentId: number;
  content: string;
  boardId: number;
  boardTitle: string;
  createdAt: string;
  reply?: boolean;
}

export const fetchMyComments = async (): Promise<MyCommentItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/comments/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '내 댓글 불러오기 실패');
};

// 스크랩한 글
export const fetchMyScraps = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/scraps/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '스크랩 글 불러오기 실패');
};

// 좋아요한 글
export const fetchMyLikes = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('https://hiteen.site/api/v1/loves/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '좋아요한 글 불러오기 실패');
};
