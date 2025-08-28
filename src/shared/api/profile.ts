import { BoardItem } from './board';
import { tokenStorage } from '../utils/safeStorage';

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

// 내 정보 조회
export const fetchMyProfile = async () => {
  const token = tokenStorage.getAccessToken();
  if (!token) throw new Error('토큰이 없습니다');

  const res = await fetch('/api/v1/members/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
};

// 프로필 수정
export const updateProfile = async (profileData: {
  name: string;
  gradeNumber: number;
  classNumber: number;
}) => {
  const token = tokenStorage.getAccessToken();
  if (!token) throw new Error('토큰이 없습니다');

  const res = await fetch('/api/v1/members/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) throw new Error('프로필 수정 실패');
  return res.json();
};

// 내 글 목록 조회
export const fetchMyPosts = async () => {
  const token = tokenStorage.getAccessToken();
  if (!token) throw new Error('토큰이 없습니다');

  const res = await fetch('/api/v1/boards/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('내 글 목록 조회 실패');
  return res.json();
};

// 내 댓글 목록 조회
export const fetchMyComments = async () => {
  const token = tokenStorage.getAccessToken();
  if (!token) throw new Error('토큰이 없습니다');

  const res = await fetch('/api/v1/comments/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('내 댓글 목록 조회 실패');
  return res.json();
};

// 스크랩한 글
export const fetchMyScraps = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('/api/v1/scraps/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '스크랩 글 불러오기 실패');
};

// 좋아요한 글
export const fetchMyLikes = async (): Promise<BoardItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('토큰 없음');

  const res = await fetch('/api/v1/loves/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeParseListResponse(res, '좋아요한 글 불러오기 실패');
};
