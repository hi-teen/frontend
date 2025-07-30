import { fetchWithAuth } from './auth';

export interface BoardItem {
  id: number;
  title: string;
  content: string;
  writer: string;
  category: string;   
  categoryLabel: string;
  loveCount: number;
  scrapCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
}

// 전체 게시글 목록 조회
export const fetchBoards = async (): Promise<BoardItem[]> => {
  const res = await fetchWithAuth('https://hiteen.site/api/v1/boards');
  if (!res.ok) throw new Error('게시글 불러오기 실패');
  const json = await res.json();
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('게시글 목록이 배열이 아님!');
  }
  return json.data;
};

// 게시글 상세 조회
export const fetchBoardDetail = async (boardId: number): Promise<BoardItem> => {
  const res = await fetchWithAuth(`https://hiteen.site/api/v1/boards/${boardId}`);
  if (!res.ok) throw new Error('상세 게시글 조회 실패');
  const json = await res.json();
  if (!json.data) throw new Error('상세 게시글 데이터가 없음');
  return json.data;
};

export const toggleLove = async (boardId: number) => {
  const res = await fetchWithAuth(`https://hiteen.site/api/v1/loves?boardId=${boardId}`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('좋아요 요청 실패');
  }
  return res.text();
};

export const toggleScrap = async (boardId: number) => {
  const res = await fetchWithAuth(`https://hiteen.site/api/v1/scraps?boardId=${boardId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('스크랩 실패');
};

export const fetchMyPosts = async (): Promise<BoardItem[]> => {
  const res = await fetchWithAuth(`https://hiteen.site/api/v1/boards/me`);
  if (!res.ok) {
    throw new Error('내 글 목록 불러오기 실패');
  }
  const json = await res.json();
  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('내 글 목록이 배열이 아님!');
  }
  return json.data;
};
  
// 인기 게시글 조회 (최대 3개)
export async function fetchPopularBoards(): Promise<any[]> {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('https://hiteen.site/api/v1/boards/popular', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json();
  // 인기순 3개만
  return Array.isArray(json.data) ? json.data.slice(0, 3) : [];
}

export async function fetchMyRooms() {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('로그인 필요');
  const res = await fetch('https://hiteen.site/api/v1/messages/rooms', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!json.data || !Array.isArray(json.data)) return [];
  return json.data;
}
